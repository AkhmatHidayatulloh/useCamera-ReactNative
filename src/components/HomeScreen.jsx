
import React from 'react';
import { View, Text, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Ini Halaman Home</Text>
            <View style={{ marginTop: 10, flexDirection: 'row', gap: 10 }}>
                <Button
                    title="Ke Camera"
                    onPress={() => navigation.navigate('Camera')}
                />
                <Button
                    title="Scan QR"
                    onPress={() => navigation.navigate('Scan')}
                />
                <Button
                    title="Print Thermal"
                    onPress={() => navigation.navigate('Print')}
                />
            </View>
        </View>
    );
}
