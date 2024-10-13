import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

const PaymentScreen = ({ route, navigation }) => {
  const { CurrentBalance } = route.params; // Obtener datos de la navegación
  const [amountToPay, setAmountToPay] = useState(0); // Monto a pagar
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    console.log('Parámetros recibidos:', route.params); // Verificar los parámetros
  }, [route.params]);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    const qrData = JSON.parse(data); // Suponiendo que el QR contiene un JSON

    // Comprobar que el ID de transacción coincida
    //if (qrData.transactionID === transactionID) {
      const response = await fetch('http://192.168.1.100:3000/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: 'user1', amountToPay: qrData.amountToPay }),
      });

      const result = await response.json();
      console.log(result)
      if (response.ok) {
        Alert.alert('Pago confirmado', `Nuevo saldo: $${result.newBalance}`);
        navigation.navigate('Home', { newBalance: result.newBalance });
      } else {
        Alert.alert('Error', result.error);
      }
    //} else {
    //  Alert.alert('Código QR inválido', 'El ID de transacción no coincide.');
   // }
  };

  if (hasPermission === null) {
    return <Text>Solicitando permiso para la cámara</Text>;
  }
  if (hasPermission === false) {
    return <Text>No se puede acceder a la cámara</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{ flex: 1 }}
      />
      {scanned && <Button title={'Escanear de nuevo'} onPress={() => setScanned(false)} />}
      <Text>Monto a pagar: ${amountToPay}</Text>
    </View>
  );
};

export default PaymentScreen;




