import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

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

});

router.get('/available/car', (req, res) => {
	const ordersFilePath = path.join(__dirname, '../db/orders.json');
	const { from, to, startDate, carType } = req.query;

	fs.readFile(jsonFilePath, 'utf8', (err, data) => {
		if (err) {
			return res.status(500).json({ message: 'Error reading orders file', status: false });
		}

		let orders = [];
		if (data) {
			orders = JSON.parse(data).orders;
		}
		const fromDate = new Date(from);
		const toDate = new Date(to);

		const conflictOrders = orders.filter(order => {
			const orderFromDate = new Date(order.from);
			const orderToDate = new Date(order.to);
			return (fromDate >= orderFromDate) && (fromDate <= orderToDate) || (toDate >= orderFromDate) && (toDate <= orderToDate);
		});




	});

	const availableDriver = driversData.drivers.find(driver => driver.online && driver.carType === carType);

	if (!availableDriver) {
		return res.status(404).json({ message: 'No available cars found', status: false });
	}

	res.json({
		message: 'Available car found',
		driver: availableDriver,
		status: true
	});
});

export default router