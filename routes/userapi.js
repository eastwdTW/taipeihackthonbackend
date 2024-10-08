import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import nodemailer from "nodemailer";
import inlineBase64 from "nodemailer-plugin-inline-base64";
import multer from "multer";
import { decryptWithPrivateKey } from "../functions/decrypt";

const router = express.Router();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/handicapFiles"); // 設定文件存儲目錄
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

router.post("/login", urlencodedParser, (req, res) => {
  const jsonFilePath = path.join(__dirname, "../db/users.json");
  // Read the users.json file
  fs.readFile(jsonFilePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Server error" });
    }

    let users;
    try {
      users = JSON.parse(data).users;
    } catch (parseError) {
      return res.status(500).json({ message: "Error parsing user data" });
    }

    const { account, password } = req.body;

    var decrypt_password = decryptWithPrivateKey(password);

    var hash = crypto
      .createHash("sha256")
      .update(`${decrypt_password}`)
      .digest("hex");

    const user = users.find((user) => user.account === account);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    console.log(hash, user.password);
    // Check if the password matches
    if (user.password !== hash) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // If authentication is successful
    res
      .status(200)
      .json({ message: "Login successful", token: user.id, name: user.name });
  });
});

router.post("/regist", upload.single("handicapFilePath"), (req, res) => {
  const jsonFilePath = path.join(__dirname, "../db/users.json");
  const { name, account, password, phone, email } = req.body;
  const handicapFilePath = req.file ? req.file.path : null;

  if (!name || !account || !password || !phone || !email || !handicapFilePath) {
    return res.status(400).json({
      message:
        "please provide the complete information (account, password, phone, email)",
      status: false,
    });
  }

  fs.readFile(jsonFilePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "failed to read users file", status: false });
    }

    let users = [];
    if (data) {
      users = JSON.parse(data).users;
    }

    const userExists = users.find((user) => user.account === account);
    if (userExists) {
      return res
        .status(409)
        .json({ message: "The account already exists", status: false });
    }

    var decrypt_password = decryptWithPrivateKey(password);

    const newUser = {
      id: crypto.createHash("sha256").update(account).digest("hex"),
      name: name,
      account: account,
      password: crypto
        .createHash("sha256")
        .update(decrypt_password)
        .digest("hex"),
      email: email,
      phone: phone,
      handicapFilePath: handicapFilePath,
    };

    users.push(newUser);

    fs.writeFile(
      jsonFilePath,
      JSON.stringify({ users }, null, 2),
      "utf8",
      (err) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ message: "failed to store users file", status: false });
        }
        return res.status(201).json({
          message: "registration success",
          status: true,
          user: newUser,
        });
      }
    );
  });
});

router.post("/forget-password", urlencodedParser, (req, res) => {
  const jsonFilePath = path.join(__dirname, "../db/users.json");
  const { account, email } = req.body;

  fs.readFile(jsonFilePath, "utf8", (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error reading users file", status: false });
    }

    let users = [];
    if (data) {
      users = JSON.parse(data).users;
    }

    const forgetPasswordUserIndex = users.findIndex(
      (user) => user.account === account && user.email === email
    );

    if (!users[forgetPasswordUserIndex]) {
      return res
        .status(404)
        .json({ message: "User not found or unmatched", status: false });
    }

    const newPassword = crypto.randomBytes(4).toString("hex");

    users[forgetPasswordUserIndex].password = crypto
      .createHash("sha256")
      .update(newPassword)
      .digest("hex");

    fs.writeFile(
      jsonFilePath,
      JSON.stringify({ users }, null, 2),
      "utf8",
      (writeErr) => {
        if (writeErr) {
          return res
            .status(500)
            .json({ message: "Error writing to users file", status: false });
        }

        const transporter = nodemailer.createTransport({
          service: "Gmail",
          secure: true,
          auth: {
            user: "karta1027710@gmail.com",
            pass: "csznqanfslnwfzwt",
          },
        });

        transporter.use("compile", inlineBase64({ cidPrefix: "somePrefix_" }));
        var content = "您的密碼已重設為" + newPassword;

        let mailOptions = {
          from: "karta1027710@gmail.com",
          to: users[forgetPasswordUserIndex].email,
          subject: "萬安關心您",
          html: `<p>
				${content}
				</p>
				<img src="cid:imgcid" id="image">`,
          attachments: [
            {
              filename: "god_fist.jpg",
              path: path.join(__dirname, "../images/god_fist.jpg"),
              cid: "imgcid",
            },
          ],
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log("Email sent: " + info.response);
        });

        res.status(200).json({
          message: "Password reset successful",
          newPassword,
          status: true,
        });
      }
    );
  });
});

router.get("/history", async (req, res) => {
  const jsonFilePath = path.join(__dirname, "../db/orders.json");
  const { customerId } = req.query;

  fs.readFile(jsonFilePath, "utf8", async (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error reading file", status: false });
    }

    try {
      const orders = JSON.parse(data).orders.filter(
        (order) => order.customerid == customerId
      );

      const newOrders = [];

      for (const order of orders) {
        const driver = await findDriverById(order.driverId);
        newOrders.push({
          ...order,
          driver: {
            name: driver?.name,
            plateNumber: driver?.plate,
          },
        });
      }

      res.json(newOrders);
    } catch (parseError) {
      res
        .status(500)
        .json({ message: "Error parsing JSON", error: parseError });
    }
  });
});

const findDriverById = async (driverId) => {
  const jsonFilePath = path.join(__dirname, "../db/drivers.json");

  return await new Promise((res) => {
    fs.readFile(jsonFilePath, "utf8", (err, data) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error reading drivers file", status: false });
      }

      let drivers = [];
      if (data) {
        drivers = JSON.parse(data).drivers;
      }

      const driver = drivers.find((driver) => driver.id === driverId);

      res(driver);
    });
  });
};

export default router;
