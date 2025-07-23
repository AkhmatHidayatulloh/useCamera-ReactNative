import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import {
    Camera,
    useCameraDevice,
    useCameraPermission,
    useCodeScanner,
} from 'react-native-vision-camera';

export default function BarcodeScanner() {
    const camera = useRef(null);
    const device = useCameraDevice('back');
    const { hasPermission, requestPermission } = useCameraPermission();

    const [scannedCode, setScannedCode] = useState('');
    const [showCamera, setShowCamera] = useState(false);

    useEffect(() => {
        requestPermission();
    }, []);

    useEffect(() => {
        console.log('📦 Nilai baru scannedCode:', scannedCode);
    }, [scannedCode]);

    const codeScanner = useCodeScanner({
        codeTypes: ['qr', 'ean-13'],
        onCodeScanned: (codes) => {

            codes.forEach(code => {
                setScannedCode(code.value);
                console.log('Barcode value:', code.value);
                console.log('ini : ', scannedCode);
            });

            setShowCamera(false);
        }
    })

    const isValidUrl = (string) => {
        try {
            const url = new URL(string);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (_) {
            return false;
        }
    };


    if (!hasPermission) {
        return (
            <View style={styles.center}>
                <Text>Meminta izin kamera...</Text>
            </View>
        );
    }

    if (showCamera && device) {
        return (
            <View style={styles.container}>
                <Camera
                    ref={camera}
                    style={StyleSheet.absoluteFill}
                    device={device}
                    isActive={true}
                    codeScanner={codeScanner}
                />
                <TouchableOpacity onPress={() => setShowCamera(false)} style={styles.closeButton}>
                    <Text style={styles.closeText}>❌ Tutup</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.center}>
            {scannedCode ? (
                isValidUrl(scannedCode) ? (
                    <TouchableOpacity onPress={() => Linking.openURL(scannedCode)}>
                        <Text style={[styles.resultText, { color: 'blue', textDecorationLine: 'underline' }]}>
                            🔗 Buka Link: {scannedCode}
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <Text style={styles.resultText}>✅ Barcode: {scannedCode}</Text>
                )
            ) : (
                <Text>Belum ada kode dipindai</Text>
            )}

            <TouchableOpacity onPress={() => setShowCamera(true)} style={styles.scanButton}>
                <Text style={styles.buttonText}>📷 Scan Barcode</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    scanButton: {
        backgroundColor: '#2196F3',
        padding: 12,
        borderRadius: 8,
        marginTop: 20,
    },
    buttonText: { color: 'white', fontWeight: 'bold' },
    closeButton: {
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        backgroundColor: '#f44336',
        padding: 12,
        borderRadius: 8,
    },
    closeText: { color: 'white', fontWeight: 'bold' },
    resultText: { fontSize: 18, marginVertical: 20, fontWeight: 'bold' },
});
