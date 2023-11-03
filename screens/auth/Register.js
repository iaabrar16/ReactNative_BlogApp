import React, { useState } from 'react';
import { Image, Text, Button, TextInput, StyleSheet, TouchableOpacity, View } from 'react-native';
import globalStyles from '../../utils/globalStyles';
import * as ImagePicker from 'expo-image-picker';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore, firebase } from '../../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

import * as FileSystem from 'expo-file-system';


const Register = () => {
    const [name, setName] = useState()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayPicture, setDisplayPicture] = useState(null);
    const [imagePicked, setImagePicked] = useState(false)

    const onPickPicture = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const imageUri = result.assets[0].uri;
            setDisplayPicture(imageUri)
            setImagePicked(true);
        }
    };

    const onClickPicture = async (fromCamera = false) => {
        let result;

        if (fromCamera) {
            result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
        } else {
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
        }

        if (!result.canceled) {
            const imageUri = result.assets[0].uri;
            setDisplayPicture(imageUri)
            setImagePicked(true);
        }
    };

    const onRegister = async () => {
        if (!email || !password) {
            console.warn("Email and password are required");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const uid = user.uid;
            let imageUrl = null


            if (displayPicture) {
                try {
                    const { uri } = await FileSystem.getInfoAsync(displayPicture)
                    const blob = await new Promise((resolve, reject) => {
                        const xhr = new XMLHttpRequest();
                        xhr.onload = () => {
                            resolve(xhr.response)
                        }
                        xhr.onerror = (e) => {
                            reject(new TypeError('Network request failed'))
                        }
                        xhr.responseType = 'blob';
                        xhr.open('GET', uri, true)
                        xhr.send(null)
                    })
                    const filename = displayPicture.substring(displayPicture.lastIndexOf('/') + 1)
                    const ref = firebase.storage().ref().child(filename)
                    await ref.put(blob)
                    // Get the download URL of the uploaded image
                    imageUrl = await ref.getDownloadURL();

                } catch (e) {
                    console.log(e)
                }

            }

            // Set user data in Firestore
            const userDocRef = doc(firestore, 'users', uid); // Reference to the specific user document
            await setDoc(userDocRef, {
                name,
                email,
                imageUrl
            });

            // Display success message
            console.warn("User registered successfully!");
            // Reset input fields
            setName('');
            setEmail('');
            setPassword('');
            setDisplayPicture(null);
            setImagePicked(false);
            // navigation.navigate('Login');

        } catch (error) {
            console.error(error);
        }
    };



    return (
        <View style={styles.container}>

            <View>
                {
                    imagePicked ? <Image style={styles.displayPicture}
                        source={{ uri: !displayPicture ? null : displayPicture }}
                    /> :
                        null
                }
            </View>
            <View style={styles.touchableContainer}>
                <TouchableOpacity onPress={onPickPicture} style={styles.clickContainer}>
                    <Text style={styles.pictureText}>Pick Picture</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onClickPicture} style={styles.clickContainer}>
                    <Text style={styles.pictureText}>Click Picture</Text>

                </TouchableOpacity>
            </View>


            <TextInput
                value={name}
                placeholder='Name'
                style={globalStyles.primaryInput}
                onChangeText={(text) => setName(text)}
            />
            <TextInput
                value={email}
                placeholder='Email'
                style={globalStyles.primaryInput}
                onChangeText={(text) => setEmail(text)}
            />
            <TextInput
                value={password}
                placeholder='Password'
                style={globalStyles.primaryInput}
                secureTextEntry={true}
                onChangeText={(text) => setPassword(text)}
            />
            <Button title='Register' onPress={onRegister}></Button>

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
    touchableContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%'
    },
    displayPicture: {
        height: 50,
        width: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    clickContainer: {
        flexDirection: 'row'
    },
    pictureText: {
        marginRight: 5,
        color: '#1aa3ff'
    }
})
export default Register;
