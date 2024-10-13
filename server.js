// server.js
const express = require('express');
const QRCode = require('qrcode-terminal'); // Cambia a la importación correcta
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let CurrentBalance = 1000; // Cambiado a let para que se pueda modificar
const historial = [{ transactionID: "ID123", monto: 100 }];

app.get("/getbalance", (req, res) => {
  console.log("estoy");
  return res.status(200).json(CurrentBalance);
});

// Ruta para generar el código QR
app.get('/generate-qr', (req, res) => {
  const amountToPay = 50; // Monto fijo de ejemplo
  const transactionID = `txn_${Date.now()}`; // ID único de transacción
  const qrData = JSON.stringify({ transactionID, amountToPay });

  // Generar el código QR en consola
  QRCode.generate(qrData, { small: true }, function (qrcode) {
    console.log('Código QR generado en consola:\n');
    console.log(qrcode); // Muestra el QR en consola

    // Enviar una respuesta al cliente
    res.status(200).json({ message: 'Código QR generado. Ver consola.', transactionID, amountToPay });
  });
});

// Ruta para procesar el pago
app.post('/process-payment', (req, res) => {
  const { amountToPay, transactionID } = req.body;

  // Verifica si hay saldo suficiente
  if (CurrentBalance >= amountToPay) {
    CurrentBalance -= amountToPay; // Actualiza el saldo
    historial.push({ transactionID, monto: amountToPay }); // Agrega al historial
    console.log(`Pago procesado: ${transactionID}, Monto: $${amountToPay}, Nuevo saldo: $${CurrentBalance}`);
    res.status(200).json({ message: 'Pago procesado con éxito', newBalance: CurrentBalance });
  } else {
    console.log("Error: no hay saldo suficiente");
    res.status(400).json({ error: 'No hay saldo suficiente' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});






//Version 1

/*const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const qrCode = require('qrcode');

const app = express();
app.use(bodyParser.json());

const SECRET_KEY = 'your_secret_key';

// Base de datos temporal (puedes usar MongoDB o cualquier otra DB)
let payments = [];

// Middleware de autenticación (opcional)
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send('Access Denied');

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).send('Invalid Token');
    req.user = user;
    next();
  });
};

// Ruta opcional para autenticación de usuarios
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Aquí deberías autenticar al usuario desde tu base de datos
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

// Ruta GET /generate-qr
app.get('/generate-qr', authenticateToken, (req, res) => {
  const { amount, transactionId } = req.query;
  if (!amount || !transactionId) {
    return res.status(400).send('Faltan parámetros.');
  }

  const paymentData = {
    transactionId,
    amount,
  };

  // Genera el código QR
  qrCode.toDataURL(JSON.stringify(paymentData), (err, url) => {
    if (err) {
      return res.status(500).send('Error generando el código QR.');
    }
    res.json({ qrCodeUrl: url });
  });
});

// Ruta POST /process-payment
app.post('/process-payment', authenticateToken, (req, res) => {
  const { transactionId } = req.body;
  if (!transactionId) {
    return res.status(400).send('Falta el ID de la transacción.');
  }

  // Aquí deberías verificar si el transactionId existe y procesar el pago
  const payment = payments.find(p => p.transactionId === transactionId);
  if (!payment) {
    return res.status(404).send('Transacción no encontrada.');
  }

  // Actualiza el estado del pago
  payment.status = 'completed';

  res.json({ message: 'Pago procesado con éxito.', payment });
});

// Puerto del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});*/
