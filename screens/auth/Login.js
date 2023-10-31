import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import globalStyles from '../../utils/globalStyles';

const Login = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onLogin = async () => {
        if (!email || !password) {
            console.warn("Email and password are required");
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.warn("User logged in successfully!");
            // Reset email and password fields after successful login
            setEmail('');
            setPassword('');

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                value={email}
                placeholder='Email'
                style={globalStyles.primaryInput}
                onChangeText={(text) => setEmail(text)}
            />
            <TextInput
                value={password}
                placeholder='Password'
                style={[globalStyles.primaryInput, styles.passwordInput]}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={true}
            />
            <Button title='Login' onPress={onLogin} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F3EFEF'
    },
    passwordInput: {
        marginTop: 10 // Add some spacing between email and password fields
    }
});

export default Login;