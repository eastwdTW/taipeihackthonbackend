import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import {decryptWithPrivateKey} from '../functions/decrypt'

const router = express.Router()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.post('/login', urlencodedParser, (req, res) => {
	const jsonFilePath = path.join(__dirname, '../db/drivers.json');

	// Read the drivers.json file
	fs.readFile(jsonFilePath, 'utf8', (err, data) => {
		if (err) {
			return res.status(500).json({ message: 'Server error' });
		}

		let drivers;
		try {
			drivers = JSON.parse(data).drivers;
		} catch (parseError) {
			return res.status(500).json({ message: 'Error parsing driver data' });
		}

		const { account, password } = req.body;

		var decrypt_password = decryptWithPrivateKey(password)
		var hash = crypto.createHash('sha256').update(decrypt_password).digest('hex');

		const driver = drivers.find(driver => driver.account === account);

		if (!driver) {
			return res.status(401).json({ message: 'User not found' });
		}

		// Check if the password matches
		if (driver.password !== hash) {
			return res.status(401).json({ message: 'Incorrect password' });
		}

		// If authentication is successful
		res.status(200).json({ message: 'Login successful', token: driver.id });
	});
});

router.post('/regist', urlencodedParser, (req, res) => {
	const usersFilePath = path.join(__dirname, '../db/drivers.json');
	const { name, account, password, phone, email, handicapFilePath } = req.body;

	if (!name || !account || !password || !phone || !email || !handicapFilePath) {
		return res.status(400).json({ message: 'please provide the complete information (account, password, phone, email)', status: false });
	}

	fs.readFile(usersFilePath, 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: 'failed to read drivers file', status: false });
		}

		let drivers = [];
		if (data) {
			drivers = JSON.parse(data).drivers;
		}

		const userExists = drivers.find(driver => driver.account === account);
		if (userExists) {
			return res.status(409).json({ message: 'The account already exists', status: false });
		}

		var decrypt_password = decryptWithPrivateKey(password)

		const newUser = {
			id: Math.random().toString(36).substr(2, 9),
			name: name,
			account: account,
			password: crypto.createHash('sha256').update(decrypt_password).digest('hex'),
			email: email,
			phone: phone,
			handicapFilePath: handicapFilePath
		};

		drivers.push(newUser);

		fs.writeFile(usersFilePath, JSON.stringify({ drivers }, null, 4), 'utf8', (err) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ message: 'failed to store drivers file', status: false });
			}
			return res.status(201).json({ message: 'registration success', status: true, driver: newUser });
		});
	});
});

router.post('/forget-password', urlencodedParser, (req, res) => {
	const usersFilePath = path.join(__dirname, '../db/drivers.json');
	const { account, email } = req.body;

	fs.readFile(usersFilePath, 'utf8', (err, data) => {
		if (err) {
			return res.status(500).json({ message: 'Error reading drivers file', status: false });
		}

		let drivers = [];
		if (data) {
			drivers = JSON.parse(data).drivers;
		}

		const forgetPasswordDriver = drivers.find(driver => (driver.account === account) && (driver.email === email));

		if (!forgetPasswordUser) {
			return res.status(404).json({ message: 'User not found or unmatched', status: false });
		}

		const newPassword = crypto.randomBytes(4).toString('hex');

		forgetPasswordDriver.password = newPassword;

		fs.writeFile(usersFilePath, JSON.stringify({ drivers }, null, 4), 'utf8', (writeErr) => {
			if (writeErr) {
				return res.status(500).json({ message: 'Error writing to drivers file', status: false });
			}

			const transporter = nodemailer.createTransport({
				service: 'Gmail',
				secure: true,
				auth: {
					driver: "karta1027710@gmail.com",
					pass: "csznqanfslnwfzwt",
				},
			});

			let mailOptions = {
				from: 'karta1027710@gmail.com', // 寄件人地址
				to: 'vincent71334@gmail.com', // 收件人地址
				subject: '重設密碼確認信', // 主題
				text: '您的密碼已重設為' + newPassword, // 郵件內容 (純文字)
			};

			transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					return console.log(error);
				}
				console.log('Email sent: ' + info.response);
			});

			res.status(200).json({ message: 'Password reset successful', newPassword, status: true });
		});
	});
});

export default router