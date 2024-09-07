import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

const router = express.Router()
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/test', (req, res) => {
	const jsonFilePath = path.join(__dirname, './db/users.json');

	var mes;

	fs.readFile(jsonFilePath, 'utf8', (err, data) => {
		console.log(data)
		mes = JSON.parse(data)
	});

	// console.log(typeof Data)
	// console.log(mes)

	return res.json({msg:"succeed"})
});

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

        // console.log(users)
        console.log(req.body)

        // Extract credentials from the request body
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

router.post('/regist', (req, res) => {
	const usersFilePath = path.join(__dirname, '../db/users.json');
	const { account, password, phone, email } = req.body;

	if (!account || !password || !phone || !email) {
		return res.status(400).json({ message: '請提供完整的註冊資訊 (account, password, phone, email)' });
	}

	fs.readFile(usersFilePath, 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: '讀取用戶資料失敗' });
		}

		let users = [];
		if (data) {
			users = JSON.parse(data);
		}


		const userExists = users.find(user => user.account === account);
		if (userExists) {
			return res.status(409).json({ message: '該帳號已經存在' });
		}

		const newUser = {
			account,
			password,
			phone,
			email
		};

		users.push(newUser);

		fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf8', (err) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ message: '無法儲存用戶資料' });
			}
			return res.status(201).json({ message: '註冊成功', user: newUser });
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