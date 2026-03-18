// Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyD5uXJo7EbWJ5L6cxMqSeo9rtWhZnQorNg',
	authDomain: 'smart-hospital-e2e5a.firebaseapp.com',
	databaseURL: 'https://smart-hospital-e2e5a-default-rtdb.firebaseio.com',
	projectId: 'smart-hospital-e2e5a',
	storageBucket: 'smart-hospital-e2e5a.appspot.com',
	messagingSenderId: '878384146519',
	appId: '1:878384146519:web:edf177416ef72a67651b12',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const byId = (id) => document.getElementById(id);

const ui = {
	temperature: byId('temperature'),
	humidity: byId('humidity'),
	gasDetected: byId('gasDetected'),
	fireDetected: byId('fireDetected'),
	canteenGas: byId('canteen-gas'),
	canteenFire: byId('canteen-fire'),
	soilMoisture: byId('soilMoisture'),
	waterSensor: byId('waterSensor'),
	motorPump: byId('motorPump'),
	hospitalPanel: byId('hospital-panel'),
	canteenPanel: byId('canteen-panel'),
	gardenPanel: byId('garden-panel'),
	hospitalSafety: byId('hospital-safety'),
	canteenSafety: byId('canteen-safety'),
	gardenState: byId('garden-state'),
	activeAlerts: byId('active-alerts'),
	lastUpdate: byId('last-update'),
	currentTime: byId('current-time'),
};

const alertState = {
	hospital: false,
	canteen: false,
	garden: false,
};

function setText(element, text) {
	if (element) {
		element.textContent = text;
	}
}

function setBadge(element, typeClass, text) {
	if (!element) {
		return;
	}

	element.className = `badge ${typeClass}`;
	element.textContent = text;
}

function setPanelState(element, state) {
	if (element) {
		element.setAttribute('data-state', state);
	}
}

function updateLastUpdate() {
	setText(ui.lastUpdate, new Date().toLocaleTimeString());
}

function refreshAlertCount() {
	const totalAlerts = Object.values(alertState).filter(Boolean).length;
	setText(ui.activeAlerts, String(totalAlerts));
}

function updateClock() {
	const now = new Date();
	setText(
		ui.currentTime,
		now.toLocaleString([], {
			weekday: 'short',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		}),
	);
}

updateClock();
setInterval(updateClock, 1000);

// Hospital Data
db.ref('Hospital').on('value', (snapshot) => {
	const data = snapshot.val() || {};

	setText(
		ui.temperature,
		data.temperature != null ? data.temperature.toFixed(2) : 'No Data',
	);
	setText(
		ui.humidity,
		data.humidity != null ? data.humidity.toFixed(2) : 'No Data',
	);

	const gasDetected = Boolean(data.gasDetected);
	const fireDetected = Boolean(data.fireDetected);
	const hasHospitalAlert = gasDetected || fireDetected;

	setText(ui.gasDetected, gasDetected ? 'Yes' : 'No');
	setText(ui.fireDetected, fireDetected ? 'Yes' : 'No');

	alertState.hospital = hasHospitalAlert;
	setPanelState(ui.hospitalPanel, hasHospitalAlert ? 'alert' : 'ok');
	setBadge(
		ui.hospitalSafety,
		hasHospitalAlert ? 'is-alert' : 'is-ok',
		hasHospitalAlert ? 'Alert' : 'Stable',
	);

	updateLastUpdate();
	refreshAlertCount();
});

// Canteen Data
db.ref('Canteen').on('value', (snapshot) => {
	const data = snapshot.val() || {};
	const gasValue = data.gasSensor;
	const fireDetected = Boolean(data.fireSensor);

	const gasRisk =
		typeof gasValue === 'number'
			? gasValue > 700
			: typeof gasValue === 'string'
				? /danger|high|critical|alert/i.test(gasValue)
				: false;

	const hasCanteenAlert = fireDetected || gasRisk;

	setText(
		ui.canteenGas,
		gasValue != null && gasValue !== '' ? String(gasValue) : 'No Data',
	);
	setText(ui.canteenFire, fireDetected ? 'Yes' : 'No');

	alertState.canteen = hasCanteenAlert;
	setPanelState(ui.canteenPanel, hasCanteenAlert ? 'alert' : 'ok');
	setBadge(
		ui.canteenSafety,
		hasCanteenAlert ? 'is-alert' : 'is-ok',
		hasCanteenAlert ? 'Attention' : 'Nominal',
	);

	updateLastUpdate();
	refreshAlertCount();
});

// Garden Data
db.ref('Garden').on('value', (snapshot) => {
	const data = snapshot.val() || {};
	const waterDetected = Boolean(data.waterSensor);
	const motorPumpOn = Boolean(data.motorPump);
	const hasGardenWarning = motorPumpOn && !waterDetected;

	setText(
		ui.soilMoisture,
		data.soilMoisture != null && data.soilMoisture !== ''
			? String(data.soilMoisture)
			: 'No Data',
	);
	setText(ui.waterSensor, waterDetected ? 'Water Detected' : 'No Water');
	setText(ui.motorPump, motorPumpOn ? 'On' : 'Off');

	alertState.garden = hasGardenWarning;
	setPanelState(ui.gardenPanel, hasGardenWarning ? 'warn' : 'ok');

	if (hasGardenWarning) {
		setBadge(ui.gardenState, 'is-warn', 'Check Water');
	} else {
		setBadge(ui.gardenState, 'is-ok', motorPumpOn ? 'Irrigating' : 'Ready');
	}

	updateLastUpdate();
	refreshAlertCount();
});
