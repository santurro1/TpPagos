import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { Camera } from 'expo-camera';

const PaymentScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [paymentData, setPaymentData] = useState({ amount: 0 });

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    // Simular información de pago basada en el QR escaneado
    setPaymentData({ amount: 150 }); // Simula un pago de $150
  };

  if (hasPermission === null) {
    return <Text>Solicitando permiso de cámara...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No se tiene acceso a la cámara</Text>;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {!scanned ? (
        <Camera
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{ height: 400, width: 400 }}
        />
      ) : (
        <>
          <Text style={{ fontSize: 24 }}>Monto a pagar: ${paymentData.amount}</Text>
          <Button
            title="Confirmar Pago"
            onPress={() => navigation.navigate('HomeScreen.jsx')}
          />
        </>
      )}
    </View>
  );
};

export default PaymentScreen;
