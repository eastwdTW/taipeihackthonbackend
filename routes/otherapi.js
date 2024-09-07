import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { formatDate, testing } from '../functions/dateformat'

const router = express.Router()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/announcement', (req, res) => {
	const jsonFilePath = path.join(__dirname, '../db/announcements.json');

	fs.readFile(jsonFilePath, 'utf8', (err, data) => {
		if (err) {
			return res.status(500).json({ message: 'Error reading file', error: err });
		}

		try {
			const announcements = JSON.parse(data);
			res.json(announcements);
		} catch (parseError) {
			res.status(500).json({ message: 'Error parsing JSON', error: parseError });
		}
	});
});

router.post('/reserve', urlencodedParser, (req, res) => {
	const jsonFilePath = path.join(__dirname, '../db/orders.json');
	const { startDate, from, to, carType, customerid } = req.body;

	if (!startDate || !from || !to || !carType || !customerid) {
		return res.status(400).json({ message: 'provided data incomplete', status: false });
	}

	fs.readFile(jsonFilePath, 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: 'failed to read orders file', status: false });
		}

		var orders;
		if (data) {
			orders = JSON.parse(data).orders;
		}

		const driverFilePath = path.join(__dirname, '../db/drivers.json');
		fs.readFile(driverFilePath, 'utf8', (err, data) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ message: 'failed to read drivers file', status: false });
			}

			var drivers;
			var newStart = new Date(startDate);

			if (data) {
				drivers = JSON.parse(data).drivers;
			}

			var validDrivers = drivers.filter((driver) => driver.carType === carType);
			var orderMayConflict = orders.filter((order) => order.carType === carType);
			orderMayConflict.forEach((order) => {
				var orderStart = new Date(order.startDate);
				var orderEnd = new Date(order.endDate);
				if (newStart >= orderStart && newStart <= orderEnd) {
					var invalidDriverIdx = validDrivers.findIndex(driver => driver.id === order.driverId)
					validDrivers.splice(invalidDriverIdx, 1);
				}
			});
			
			if (!validDrivers || validDrivers.length === 0) {
				return res.status(200).json({ message: 'no driver available', status: false });
			} else {
				var validDriver = validDrivers[0].id;

				const newOrder = {
					id: Math.random().toString(36).substr(2, 9),
					startDate: startDate,
		            endDate: formatDate(newStart.setHours(newStart.getHours()+2)),
		            from: from,
		            to: to,
		            carType: carType,
		            driverId: validDriver,
		            customerid: customerid
				};

				orders.push(newOrder);

				fs.writeFile(jsonFilePath, JSON.stringify({ orders }, null, 4), 'utf8', (err) => {
					if (err) {
						console.error(err);
						return res.status(500).json({ message: 'failed to store file', status: false });
					}
					return res.status(200).json({ message: 'reservation success', status: true, order: newOrder });
				});
			}
			validDriver = validDrivers[0].id;
		});

		const newOrder = {
			id: Math.random().toString(36).substr(2, 9),
			startDate: startDate,
			endDate: null,
			from: from,
			to: to,
			carType: carType,
			driverId: validDriver,
			customerid: customerid
		};

		orders.push(newOrder);

		fs.writeFile(jsonFilePath, JSON.stringify({ orders }, null, 4), 'utf8', (err) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ message: 'failed to store file', status: false });
			}
			return res.status(200).json({ message: 'registration success', status: true, order: newOrder });
		});
	});
});

router.get('/available/car', (req, res) => {
	const ordersFilePath = path.join(__dirname, '../db/orders.json');
	const driversFilePath = path.join(__dirname, '../db/drivers.json');
	const { from, to, startDate, carType } = req.query;

	fs.readFile(ordersFilePath, 'utf8', (err, data) => {
		if (err) {
			return res.status(500).json({ message: 'Error reading orders file', status: false });
		}

		let orders = [];
		if (data) {
			orders = JSON.parse(data).orders;
		}

		const conflictOrders = orders.filter((order) => (
			(startDate >= order.startDate) && (startDate <= order.endDate)
		));

		const conflictdriverIds = conflictOrders.map(order => order.driverId);
		fs.readFile(driversFilePath, 'utf8', (driversErr, driverData) => {
			if (driversErr) {
				return res.status(500).json({ message: 'Error reading drivers file', status: false });
			}

			let drivers = [];
			if (driverData) {
				drivers = JSON.parse(driverData).drivers;
			}

			const availableDriver = drivers.find((driver) => ((!conflictdriverIds.includes(driver.id)) && (driver.carType === carType)));
			if (!availableDriver) {
				return res.json({ status: false, message: 'No available driver' });
			}
			res.json({ status: true, carType: availableDriver.carType, waitingTime: "00:30:00", driverId: availableDriver.id, price: 320 });
		});

	});

});

export default router