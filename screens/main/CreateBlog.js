import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
import { addDoc, collection, serverTimestamp, onSnapshot } from 'firebase/firestore';
import globalStyles from '../../utils/globalStyles';
import { auth, firestore, firebase } from '../../firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';


const CreateBlog = ({ navigation, route }) => {

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [coverImg, setCoverImg] = useState(null);

    let id = route.params?.id;
    const currentUser = auth.currentUser;
    const uid = currentUser ? currentUser.uid : null;





    const onUploadImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
            const selectedAsset = result.assets[0];
            setCoverImg(selectedAsset.uri);
        }
    };





    function onCheck() {
        if (id) {
            onUpdate(id);

            return;
        }
        onCreate();
    }

    useEffect(() => {
        if (id && uid) {
            getBlogData(id);
        }
    }, [id, uid]);


    function getBlogData(id) {
        const blogDocRef = doc(collection(firestore, 'usersBlog', uid, 'blogs'), id);
        const unsubscribe = onSnapshot(blogDocRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();
                setTitle(data.title);
                setContent(data.content);
                setCoverImg(data.coverImage);
            }
        });

        // Return the unsubscribe function
        return unsubscribe;
    }




    const uploadCover = async (uid) => {
        try {
            if (coverImg) {
                const response = await fetch(coverImg);
                const blob = await response.blob();
                const filename = coverImg.substring(coverImg.lastIndexOf('/') + 1);
                const ref = firebase.storage().ref().child(`images/${filename}`);
                await ref.put(blob);
                // Get the download URL of the uploaded image
                const downloadURL = await ref.getDownloadURL();
                console.log('url from firsebase: ', downloadURL)

                return downloadURL;
            }
        } catch (error) {
            console.error(error);
        }
    };





    const onCreate = async () => {
        if (!title || !content) {
            console.log('Title and content are required.');
            return;
        }

        const downloadURL = await uploadCover(uid);

        if (downloadURL) {
            try {
                await addDoc(collection(firestore, 'usersBlog', uid, 'blogs'), {
                    title,
                    content,
                    coverImage: downloadURL,
                    createdAt: serverTimestamp(),
                });

                // Clear form fields after creating the blog
                setTitle('');
                setContent('');
                setCoverImg(null);
                console.warn('succefully uploaded blog data')
                // onUpdateSuccess();

                navigation.navigate('Home');
            } catch (error) {
                console.error(error);
            }
        } else {
            console.log('Failed to upload the cover image.');
        }
    };




    // ... rest of your code

    const onUpdate = async (id) => {
        try {
            let downloadURL = coverImg; // Default to the new cover image URL

            if (coverImg) {
                const storageRef = firebase.storage().ref().child(`images/${id}`);
                const response = await fetch(coverImg);
                const blob = await response.blob();
                await storageRef.put(blob); // Upload the image directly to the storage reference

                // Get the download URL of the uploaded image
                downloadURL = await storageRef.getDownloadURL();
            }

            // Update the document in Firestore
            const blogDocRef = doc(collection(firestore, 'usersBlog', uid, 'blogs'), id);
            await updateDoc(blogDocRef, {
                title,
                content,
                coverImage: downloadURL,
                lastUpdate: serverTimestamp(),
            });
            getBlogData(id)
            console.warn("you updated your blog")
            navigation.navigate('Home');

        } catch (error) {
            console.error(error);
        }
    };




    return (
        <ScrollView
            style={globalStyles.primaryContainer}
            keyboardShouldPersistTaps={'always'}
        >
            <Text style={{ ...globalStyles.headingText, margin: 10 }}>Create A Blog</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                    style={styles.input}
                    multiline={true}
                    numberOfLines={2}
                    value={title}
                    onChangeText={(text) => setTitle(text)}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Content</Text>
                <TextInput
                    style={styles.input}
                    multiline={true}
                    numberOfLines={10}
                    value={content}
                    onChangeText={(text) => setContent(text)}
                    underlineColorAndroid="transparent"
                />
            </View>
            <View>
                <Image style={styles.image} source={{ uri: coverImg }} resizeMode="cover" />
                <TouchableOpacity onPress={onUploadImage}>
                    <Text style={styles.pickImageText}>Pick Cover Image
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.uploadContainer}>
                <TouchableOpacity style={[styles.touchabelBtn, globalStyles.uploadBtn]} onPress={onCheck}>
                    <Text style={globalStyles.btnText}>Upload Blog</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};
const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        marginHorizontal: 10,
        marginVertical: 10,
        borderRadius: 2,
        padding: 10,
        textAlignVertical: 'top',
        fontSize: 16,
    },
    label: {
        fontSize: 18,
        margin: 10,
    },
    touchabelBtn: {
        ...globalStyles.primaryTouchableBtn,
        width: 200,
        marginHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 50,
        height: 50,
    },
    uploadBtn: {
        position: 'absolute',
        top: 10,
        right: 10,
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowOpacity: 0.5,
        elevation: 10,
    },
    pickImageText: {
        color: 'blue',
        textAlign: 'center'
    },
    uploadContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20
    }

})
export default CreateBlog;