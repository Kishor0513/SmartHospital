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

// Hospital Data
const tempElement = document.getElementById('temperature');
const humidityElement = document.getElementById('humidity');
const gasDetectedElement = document.getElementById('gasDetected');
const fireDetectedElement = document.getElementById('fireDetected');

db.ref('Hospital').on('value', (snapshot) => {
	const data = snapshot.val();
	tempElement.textContent = data.temperature
		? data.temperature.toFixed(2)
		: 'No Data';
	humidityElement.textContent = data.humidity
		? data.humidity.toFixed(2)
		: 'No Data';
	gasDetectedElement.textContent = data.gasDetected ? 'Yes' : 'No';
	fireDetectedElement.textContent = data.fireDetected ? 'Yes' : 'No';
});

// Canteen Data
const canteenGasElement = document.getElementById('canteen-gas');
const canteenFireElement = document.getElementById('canteen-fire');

db.ref('Canteen').on('value', (snapshot) => {
	const data = snapshot.val();
	canteenGasElement.textContent = data.gasSensor || 'No Data';
	canteenFireElement.textContent = data.fireSensor ? 'Yes' : 'No';
});

// Garden Data
const soilMoistureElement = document.getElementById('soilMoisture');
const waterSensorElement = document.getElementById('waterSensor');
const motorPumpElement = document.getElementById('motorPump');

db.ref('Garden').on('value', (snapshot) => {
	const data = snapshot.val();
	soilMoistureElement.textContent = data.soilMoisture || 'No Data';
	waterSensorElement.textContent = data.waterSensor
		? 'Water Detected'
		: 'No Water';
	motorPumpElement.textContent = data.motorPump ? 'On' : 'Off';
});
