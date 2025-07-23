import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    Alert,
    ScrollView,
} from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import RNFS from 'react-native-fs';

export default function CameraScreen() {
    const camera = useRef(null);
    const device = useCameraDevice('back');
    const { hasPermission, requestPermission } = useCameraPermission();

    const [photoUri, setPhotoUri] = useState(null);
    const [showCamera, setShowCamera] = useState(false);

    const [idPenjualan, setIdPenjualan] = useState('');
    const [idKurir, setIdKurir] = useState('');
    const [statKirim, setStatKirim] = useState('');
    const [note, setNote] = useState('');
    const [penerima, setPenerima] = useState('');

    const takePhoto = async () => {
        if (camera.current == null) return;
        try {
            const photo = await camera.current.takePhoto({
                flash: 'off',
            });
            const photoPath = 'file://' + photo.path;
            console.log('📷 Photo taken:', photoPath);
            setPhotoUri(photoPath);
            setShowCamera(false);
        } catch (err) {
            console.error('Error taking photo:', err);
        }
    };

    const handleSubmit = async () => {
        if (!photoUri || !idPenjualan || !idKurir || !statKirim || !note || !penerima) {
            Alert.alert('Lengkapi semua field!');
            return;
        }

        try {
            const formData = new FormData();

            formData.append('id_penjualan', idPenjualan);
            formData.append('kurir_id', idKurir);
            formData.append('stat_kirim', statKirim);
            formData.append('note', note);
            formData.append('penerima', penerima);

            formData.append('foto', {
                uri: photoUri,
                name: 'photo.jpg',
                type: 'image/jpeg',
            });

            const response = await fetch('https://qurir.lpnudev.my.id/react/Dash/ambilOrder', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-token': 'M2VlNDAwZWJmN2NmYmEyNDBlMzRjZjYwMTQ3NDIwZjMyYzgzNjA2NTkxYTZjMzk3ZjI2NjY2YTI1NWE4NjI1YzIwNDQ5NTYxMmYyZjBhNzI3OTQ2ZGY1Y2E2MzljZTgyYjA4YjcyZmRlNTQ1MmNlN2NjNzE2Mjg1NjQ3OGUyNTA=',
                    'deviceid': '37aa5a2cfa30709d',
                },
            });

            const result = await response.json();
            Alert.alert('Sukses', JSON.stringify(result));
        } catch (error) {
            console.error(error);
            Alert.alert('Gagal mengirim', error.message);
        }
    };

    if (!hasPermission) {
        return (
            <View style={styles.center}>
                <Text>Meminta izin kamera...</Text>
                <TouchableOpacity onPress={requestPermission} style={styles.button}>
                    <Text style={styles.buttonText}>Izinkan Kamera</Text>
                </TouchableOpacity>
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
                    photo={true}
                />
                <TouchableOpacity onPress={takePhoto} style={styles.captureButton}>
                    <Text style={styles.captureText}>📷 Jepret</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.center}>
            {photoUri ? (
                <>
                    <Image source={{ uri: photoUri }} style={styles.preview} />
                    <Text>Hasil Jepretan</Text>
                </>
            ) : (
                <Text>Belum ada foto diambil</Text>
            )}

            <TouchableOpacity onPress={() => setShowCamera(true)} style={styles.button}>
                <Text style={styles.buttonText}>📸 Buka Kamera</Text>
            </TouchableOpacity>

            {/* Form Input */}
            <TextInput
                style={styles.input}
                placeholder="ID Penjualan"
                value={idPenjualan}
                onChangeText={setIdPenjualan}
            />
            <TextInput
                style={styles.input}
                placeholder="ID Kurir"
                value={idKurir}
                onChangeText={setIdKurir}
            />
            <TextInput
                style={styles.input}
                placeholder="Status Kirim"
                value={statKirim}
                onChangeText={setStatKirim}
            />
            <TextInput
                style={styles.input}
                placeholder="Note"
                value={note}
                onChangeText={setNote}
            />
            <TextInput
                style={styles.input}
                placeholder="Penerima"
                value={penerima}
                onChangeText={setPenerima}
            />

            <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                <Text style={styles.buttonText}>🚀 Kirim Data</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'flex-end' },
    center: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    button: {
        backgroundColor: '#2196F3',
        padding: 12,
        borderRadius: 8,
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: { color: 'white', fontWeight: 'bold' },
    captureButton: {
        backgroundColor: '#fff',
        alignSelf: 'center',
        marginBottom: 40,
        padding: 16,
        borderRadius: 50,
    },
    captureText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    preview: {
        width: 300,
        height: 400,
        marginBottom: 20,
        borderRadius: 10,
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 10,
        width: '100%',
        borderRadius: 8,
        marginTop: 10,
    },
});
