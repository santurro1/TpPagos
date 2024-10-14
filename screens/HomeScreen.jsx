import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';

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
    <View style={styles.container}>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceText}>Saldo actual</Text>
        <Text style={styles.balanceAmount}>${CurrentBalance}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handlePayPress}>
        <Text style={styles.buttonText}>Escanear QR para realizar un pago</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f7',
  },
  balanceContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  balanceText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 5,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2a9d8f',
  },
  button: {
    backgroundColor: '#2a9d8f',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default HomeScreen;
