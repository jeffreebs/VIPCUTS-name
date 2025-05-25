// app/auth.js
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Alert, Button, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../firebase/firebaseConfig';

export default function loginregister() {
  const [isRegister, setIsRegister] = useState(false);
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [rol, setRol] = useState('cliente');
  const router = useRouter();

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setNombre('');
    setCorreo('');
    setClave('');
  };

  const handleRegistro = async () => {
    if (!nombre || !correo || !clave) {
      return Alert.alert('Campos incompletos', 'Completá todos los campos');
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, correo, clave);
      const user = userCredential.user;

      await setDoc(doc(db, 'Usuarios', user.uid), {
        nombre,
        correo,
        rol,
        uid: user.uid
      });

      Alert.alert('Registro exitoso', `Bienvenido ${nombre}`);
      // Acá podrías redirigir según el rol
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message);
    }
  };

  const handleLogin = async () => {
    if (!correo || !clave) {
      return Alert.alert('Faltan datos', 'Por favor completá tu correo y contraseña');
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, correo, clave);
      const user = userCredential.user;

      const docRef = doc(db, 'Usuarios', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const rol = data.rol;

        Alert.alert('Bienvenido', `Hola ${data.nombre} (${rol})`);
        // Aquí podés redirigir según el rol:
        if (rol === 'admin') {
          router.replace('/tabs/adminHome');
        } else if (rol === 'barbero') {
          router.replace('/tabs/barberoHome');
        } else {
          router.replace('/tabs/clienteHome');
        }
      } else {
        Alert.alert('Error', 'No se encontró información del usuario');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error al iniciar sesión', error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      {isRegister && (
        <>
          <Text>Nombre completo:</Text>
          <TextInput value={nombre} onChangeText={setNombre} placeholder="Nombre" style={{ borderWidth: 1, marginBottom: 10 }} />
        </>
      )}

      <Text>Correo:</Text>
      <TextInput value={correo} onChangeText={setCorreo} placeholder="Correo" keyboardType="email-address" style={{ borderWidth: 1, marginBottom: 10 }} />

      <Text>Contraseña:</Text>
      <TextInput value={clave} onChangeText={setClave} placeholder="Contraseña" secureTextEntry style={{ borderWidth: 1, marginBottom: 10 }} />

      {isRegister && (
        <>
          <Text>Rol:</Text>
          <Picker selectedValue={rol} onValueChange={(itemValue) => setRol(itemValue)}>
            <Picker.Item label="Cliente" value="cliente" />
            <Picker.Item label="Barbero" value="barbero" />
            <Picker.Item label="Administrador" value="admin" />
          </Picker>
        </>
      )}

      <Button title={isRegister ? "Registrarse" : "Iniciar sesión"} onPress={isRegister ? handleRegistro : handleLogin} />

      <TouchableOpacity onPress={toggleMode} style={{ marginTop: 20 }}>
        <Text style={{ color: 'blue', textAlign: 'center' }}>
          {isRegister ? "¿Ya tenés cuenta? Iniciá sesión" : "¿No tenés cuenta aún? Registrate"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
