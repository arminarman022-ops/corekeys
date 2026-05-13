require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/send-email', (req, res) => {
  const { email, kod, artikal } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `Nova narudžba: ${artikal}`,
    text: `Email kupca: ${email}\nKliker bon kod: ${kod}\nArtikal: ${artikal}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Greška:", error);
      return res.status(500).send("Greška pri narudžbi");
    }
    res.status(200).send("Uspješno poslano!");
  });
});

app.listen(PORT, () => {
  console.log(`Server pokrenut na portu ${PORT}`);
});