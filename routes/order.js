import express from 'express'
import fs from 'fs';
import path from 'path';
import "../db/orders.json"

const router = express.Router()

router.get('/orders', (req, res) => {
	const jsonFilePath = path.join(__dirname, '../db/orders.json');

	fs.readFile(jsonFilePath, 'utf8', (err, data) => {
		if (err) {
			return res.status(500).json({ message: 'Error reading file', error: err });
		}

		try {
			const orders = JSON.parse(data);
			res.json(orders);
		} catch (parseError) {
			res.status(500).json({ message: 'Error parsing JSON', error: parseError });
		}
	});
});

export default router