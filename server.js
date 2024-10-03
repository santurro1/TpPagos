const express = require('express');
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
});
