import express from 'express'
import fs from 'fs';
import path from 'path';
import "../db/drivers.json"

const router = express.Router()

router.get('/drivers', (req, res) => {
	const jsonFilePath = path.join(__dirname, '../db/drivers.json');

	fs.readFile(jsonFilePath, 'utf8', (err, data) => {
		if (err) {
			return res.status(500).json({ message: 'Error reading file', error: err });
		}

		try {
			const drivers = JSON.parse(data);
			res.json(drivers);
		} catch (parseError) {
			res.status(500).json({ message: 'Error parsing JSON', error: parseError });
		}
	});
});

export default router