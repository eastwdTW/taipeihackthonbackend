import express from 'express'
import fs from 'fs';
import path from 'path';

const router = express.Router()

router.get('/test', (req, res) => {
	const jsonFilePath = path.join(__dirname, './db/users.json');

	var Data;

	fs.readFile(jsonFilePath, 'utf8', (err, data) => {
		Data = Json.parse(data)
	});

	console.log

	return res.status(200)
});

router.post('/login', (req, res) => {
	const jsonFilePath = path.join(__dirname, '../db/users.json');

	fs.readFile(jsonFilePath, 'utf8', (err, data) => {
		// if (err) {
		// 	return res.status(500).json({ message: 'Error reading file', error: err });
		// }

		// try {
		// 	const drivers = JSON.parse(data);
		// 	res.json(drivers);
		// } catch (parseError) {
		// 	res.status(500).json({ message: 'Error parsing JSON', error: parseError });
		// }
		console.log(data)
	});
});

router.post('/regist', (req, res) => {

});

router.post('/forget-password', (req, res) => {

});

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