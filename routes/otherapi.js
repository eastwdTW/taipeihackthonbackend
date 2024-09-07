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

		let orders;
		if (data) {
			orders = JSON.parse(data).orders;
		}

		const driverFilePath = path.join(__dirname, '../db/drivers.json');
		fs.readFile(driverFilePath, 'utf8', (err, data) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ message: 'failed to read orders file', status: false });
			}

			
		});

		const newOrder = {
			id: Math.random().toString(36).substr(2, 9),
			startDate: startDate,
            endDate: null,
            from: from,
            to: to,
            carType: carType,
            driverId: null,
            customerid: customerid
		};

		orders.push(newOrder);

		fs.writeFile(jsonFilePath, JSON.stringify({ orders }, null, 4), 'utf8', (err) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ message: 'failed to store file', status: false });
			}
			return res.status(201).json({ message: 'registration success', status: true, order: newOrder });
		});
	});
});

router.get('available/car', (req, res) => {
	const {from, to, startDate, carType} = req.query;


});

export default router