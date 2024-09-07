import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

const router = express.Router()
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })


router.post('/login', urlencodedParser, (req, res) => {
	const jsonFilePath = path.join(__dirname, './db/users.json');

	// Read the users.json file
	fs.readFile(jsonFilePath, 'utf8', (err, data) => {
		if (err) {
			return res.status(500).json({ message: 'Server error' });
		}

		let users;
		try {
			users = JSON.parse(data).users;
		} catch (parseError) {
			return res.status(500).json({ message: 'Error parsing user data' });
		}

		// Extract credentials from the request body
		console.log(req.body)
		const { account, password } = req.body;

		// Find the user with the provided account
		const user = users.find(user => user.account === account);
		console.log(user)

		if (!user) {
			return res.status(401).json({ message: 'User not found' });
		}

		// Check if the password matches
		if (user.password !== password) {
			return res.status(401).json({ message: 'Incorrect password' });
		}

		// If authentication is successful
		res.status(200).json({ message: 'Login successful' });
	});
});

router.post('/regist', urlencodedParser, (req, res) => {
	const usersFilePath = path.join(__dirname, './db/users.json');
	const { name, account, password, phone, email, handicapFilePath } = req.body;

	console.log(req.body)

	if (!name || !account || !password || !phone || !email || !handicapFilePath) {
		return res.status(400).json({ message: 'please provide the complete information (account, password, phone, email)', status: false });
	}

	fs.readFile(usersFilePath, 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: 'failed to read users file', status: false });
		}

		let users = [];
		if (data) {
			users = JSON.parse(data).users;
		}

		const userExists = users.find(user => user.account === account);
		if (userExists) {
			return res.status(409).json({ message: 'The account already exists', status: false });
		}

		const newUser = {
			id: Math.random().toString(36).substr(2, 9),
			name: name,
			account: account,
			password: password,
			email: email,
			phone: phone,
			handicapFilePath: handicapFilePath
		};

		users.push(newUser);

		fs.writeFile(usersFilePath, JSON.stringify({ users }, null, 2), 'utf8', (err) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ message: 'failed to store users file', status: false });
			}
			return res.status(201).json({ message: 'registration success', status: true, user: newUser });
		});
	});
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