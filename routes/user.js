import express from 'express'
import fs from 'fs';
import path from 'path';
import "../db/users.json"

const router = express.Router()

router.get('/users', (req, res) => {
	const jsonFilePath = path.join(__dirname, '../db/users.json');

	fs.readFile(jsonFilePath, 'utf8', (err, data) => {
		if (err) {
			return res.status(500).json({ message: 'Error reading file', error: err });
		}

		try {
			const users = JSON.parse(data);
			res.json(users);
		} catch (parseError) {
			res.status(500).json({ message: 'Error parsing JSON', error: parseError });
		}
	});
});

export default router