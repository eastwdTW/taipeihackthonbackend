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
	const usersFilePath = path.join(__dirname, './db/users.json');
	const { name, account, password, phone, email, handicapFilePath } = req.body;

	console.log(req.body)

	if (!name || !account || !password || !phone || !email || !handicapFilePath) {
		return res.status(400).json({ message: '請提供完整的註冊資訊 (account, password, phone, email)' });
	}

	fs.readFile(usersFilePath, 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: '讀取用戶資料失敗' });
		}

		let users = [];
		if (data) {
			users = JSON.parse(data).users;
		}

		const userExists = users.find(user => user.account === account);
		if (userExists) {
			return res.status(409).json({ message: '該帳號已經存在' });
		}

		const newUser = {
			id: Math.random().toString(36).substr(2, 9),
			name: name,
			account: account,
			password_hashed: password,
			email: email,
			phone: phone,
			handicapFilePath: handicapFilePath
		};

		users.push(newUser);

		fs.writeFile(usersFilePath, JSON.stringify({ users }, null, 2), 'utf8', (err) => {
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