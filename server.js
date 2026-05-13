const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

// Postavke za tvoj Gmail koristeći tvoj novi App Password
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'arminarman022@gmail.com',
        pass: 'dysohsqsxejhesrf' // Tvoj novi kod je ubačen ovdje
    }
});

app.post('/naruci', (req, res) => {
    const { email, kod, artikal } = req.body;

    const mailZaTebe = {
        from: 'arminarman022@gmail.com',
        to: 'arminarman022@gmail.com',
        subject: `NOVA NARUDŽBA: ${artikal}`,
        text: `Stigla je nova narudžba!\n\nKupac: ${email}\nArtikal: ${artikal}\nKliker bon (14 brojeva): ${kod}`
    };

    const mailZaKupca = {
        from: 'arminarman022@gmail.com',
        to: email,
        subject: 'Potvrda narudžbe - CoreKeys BIH',
        text: `Hvala na povjerenju! Vaša narudžba za ${artikal} je zaprimljena.\n\nVaš Kliker bon se trenutno provjerava. Ubrzo ćemo vam poslati licencu na ovaj email.`
    };

    // Slanje mejlova
    transporter.sendMail(mailZaTebe);
    transporter.sendMail(mailZaKupca, (err) => {
        if(err) {
            console.log("Greška kod slanja:", err);
            return res.status(500).send();
        }
        res.status(200).send();
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Server uspješno pokrenut na http://localhost:${PORT}`));