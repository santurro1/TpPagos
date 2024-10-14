// server.js
const express = require('express');
const QRCode = require('qrcode-terminal'); 
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let CurrentBalance = 1000; 
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
