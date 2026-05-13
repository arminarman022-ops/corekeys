const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Omogućava serveru da čita podatke iz formi
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Služi fajlove iz "public" foldera (index.html, style.css...)
app.use(express.static(path.join(__dirname, 'public')));

// Konfiguracija za slanje emaila
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'arminarman022@gmail.com',
    pass: process.env.EMAIL_PASS // Povlači šifru iz Render Environment Variables
  }
});

// Ruta za slanje emaila (npr. kada neko kupi ključ ili pošalje upit)
app.post('/send-email', (req, res) => {
  const { email, message, keyType } = req.body;

  const mailOptions = {
    from: 'arminarman022@gmail.com',
    to: 'arminarman022@gmail.com', // Ovdje dobijaš obavijest o kupovini
    subject: `Nova narudžba ključa: ${keyType || 'Digital Product'}`,
    text: `Email kupca: ${email}\nPoruka: ${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Greška pri slanju emaila.");
    }
    console.log('Email poslan: ' + info.response);
    res.send("Uspješno poslano! Provjerite svoj email.");
  });
});

app.listen(PORT, () => {
  console.log(`Server uspješno pokrenut na portu ${PORT}`);
});