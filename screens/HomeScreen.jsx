import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const [balance, setBalance] = useState(500); // Saldo simulado
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>Saldo actual: ${balance}</Text>
      <Button
        title="Escanear código QR"
        onPress={() => navigation.navigate('Payment')}
      />
    </View>
  );
};

export default HomeScreen;
