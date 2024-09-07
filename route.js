import express from 'express'
import fs from 'fs';
import path from 'path';

const router = express.Router()

router.get('/test', (req, res) => {
	const jsonFilePath = path.join(__dirname, './db/users.json');

	var mes;

	fs.readFile(jsonFilePath, 'utf8', (err, data) => {
		console.log(data)
		mes = JSON.parse(data)
	});

	console.log(typeof Data)
	console.log(mes)

	return res.json({msg:"succeed"})
});

router.post('/login', (req, res) => {
	const jsonFilePath = path.join(__dirname, '../db/users.json');

	// Read the users.json file
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Server error' });
        }

        let users;
        try {
            users = JSON.parse(data);
        } catch (parseError) {
            return res.status(500).json({ message: 'Error parsing user data' });
        }

        // Extract credentials from the request body
        const { account, password } = req.body;

        // Find the user with the provided account
        const user = users.find(user => user.account === account);

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if the password matches
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // If authentication is successful
        res.status(200).json({ message: 'Login successful' });
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