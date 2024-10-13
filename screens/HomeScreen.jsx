import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';

const HomeScreen = ({ navigation, route }) => {
  const [CurrentBalance, setCurrentBalance] = useState(0); // Saldo actual del usuario
  
  // Obtener el saldo del servidor
  const getData = async () => {
    try {
      const res = await fetch("http://192.168.1.100:3000/getbalance");
      const data = await res.json();
      console.log(data);
      setCurrentBalance(data);
    } catch (error) {
      console.log("Error en la obtención del balance:", error);
    }
  };

  // useEffect para obtener el saldo inicial
  useEffect(() => {
    getData();
  }, []);

  // useEffect para actualizar el saldo cuando se regresa de PaymentScreen
  useEffect(() => {
    if (route.params?.newBalance) {
      setCurrentBalance(route.params.newBalance); // Actualiza el saldo con el nuevo balance
    }
  }, [route.params?.newBalance]);

  const handlePayPress = () => {
    navigation.navigate('Payment', {
      CurrentBalance
    });
  };

  return (
    <View>
      <Text>Saldo actual: ${CurrentBalance}</Text>
      <Button title="Escanear QR para realizar un pago" onPress={handlePayPress} />
    </View>
  );
};

export default HomeScreen;

