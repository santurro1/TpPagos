import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

const PaymentScreen = ({ route, navigation }) => {
  const { CurrentBalance } = route.params; // Obtener datos de la navegación
  const [amountToPay, setAmountToPay] = useState(0); // Monto a pagar
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  // Solicitar permiso para la cámara
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Manejar el escaneo del código QR
  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    const qrData = JSON.parse(data); // Suponiendo que el QR contiene un JSON con la transacción

    // Aquí actualizamos el estado con el monto que viene en el QR
    setAmountToPay(qrData.amountToPay); 

    // Realizamos el proceso de pago
    const response = await fetch('http://192.168.1.100:3000/process-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: 'user1', amountToPay: qrData.amountToPay }),
    });

    const result = await response.json();
    console.log(result);
    if (response.ok) {
      Alert.alert('Pago confirmado', `Nuevo saldo: $${result.newBalance}`);
      navigation.navigate('Home', { newBalance: result.newBalance });
    } else {
      Alert.alert('Error', result.error);
    }
  };

  if (hasPermission === null) {
    return <Text style={styles.infoText}>Solicitando permiso para la cámara</Text>;
  }
  if (hasPermission === false) {
    return <Text style={styles.infoText}>No se puede acceder a la cámara</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={styles.scanner}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  scanner: {
    width: '100%',
    height: '70%',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  amountText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default PaymentScreen;