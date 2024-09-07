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

router.get('available/car', (req, res) => {
	const {from, to, startDate, carType} = req.query;

	
});

export default router