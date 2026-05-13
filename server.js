require('dotenv').config(); // Ovo mora biti na prvoj liniji
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Srednji slojevi za čitanje podataka
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Služi statične fajlove iz "public" foldera
app.use(express.static(path.join(__dirname, 'public')));

// Konfiguracija transportera koristeći tvoje varijable sa Rendera
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Vuče arminarman022@gmail.com
    pass: process.env.EMAIL_PASS  // Vuče dysohsqsxejhesrf
  }
});

// Ruta za obradu narudžbe
app.post('/send-email', (req, res) => {
  const { email, message, keyType } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Ti dobijaš obavijest o narudžbi
    subject: `Nova narudžba ključa: ${keyType || 'Digitalni Proizvod'}`,
    text: `Email kupca: ${email}\nPoruka: ${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Greška u logovima: ", error); // Ovo ćeš vidjeti u Render Logs
      return res.status(500).send("Greska pri naruđbi");
    }
    console.log('Email uspješno poslan: ' + info.response);
    res.send("Uspješno poslano! Provjerite svoj email.");
  });
});

app.listen(PORT, () => {
  console.log(`Server uspješno pokrenut na portu ${PORT}`);
});