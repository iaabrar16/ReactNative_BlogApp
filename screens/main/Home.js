import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { getDocs, collection } from 'firebase/firestore';
import { doc, deleteDoc } from 'firebase/firestore';

import { auth, firestore, firebase } from '../../firebaseConfig';
import { getAuth, signOut } from 'firebase/auth';

import ModalView from '../../components/ModalView';

import globalStyles from '../../utils/globalStyles';
import BlogCard from '../../components/BlogCard';
import { UserContext } from '../../components/UserContext';

const Home = ({ navigation }) => {
    const [blogs, setBlogs] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCardId, setSelectedCardId] = useState([]);
    const { setLoggedIn } = useContext(UserContext);

    const onLogout = async () => {
        const auth = getAuth();
        try {
            await signOut(auth);
            setLoggedIn(false);
        } catch (error) {
            console.error('Error signing out:', error);
        }

    };

    const getBlogData = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const querySnapshot = await getDocs(collection(firestore, 'usersBlog', user.uid, 'blogs'));
                const data = [];
                querySnapshot.forEach((doc) => {
                    data.push({
                        id: doc.id,
                        ...doc.data(),
                    });
                });
                setBlogs(data);
                console.log("data from firebase", data);
            } else {
                console.log("User not authenticated");
                // Handle the case where the user is not authenticated
            }
        } catch (error) {
            console.error('Error fetching blog data:', error);
        }
    };


    useEffect(() => {
        getBlogData();
    }, []);



    function onModalOpen(cardId) {
        setModalOpen(true);
        setSelectedCardId(cardId);
    }
    function onCloseModal() {
        setModalOpen(false);
        setSelectedCardId(null);
    }

    function moveToBlogScreen(blogData) {
        navigation.navigate('Blog', {
            blogData
        });
    }

    function onUpdateBlog() {
        navigation.navigate('CreateBlog', { id: selectedCardId });
        setSelectedCardId(null);
        setModalOpen(false);
        getBlogData()
    }
    function onDeleteBlog() {
        setModalOpen(false);
        const blogRef = doc(firestore, 'usersBlog', auth.currentUser.uid, 'blogs', selectedCardId);

        deleteDoc(blogRef)
            .then(() => {
                console.warn('Document successfully deleted!');
                getBlogData()
            })
            .catch((error) => {
                console.error('Error deleting document: ', error);
            });

        setSelectedCardId(null);
    }

    return (
        <ScrollView style={globalStyles.primaryContainer}>
            <Modal
                visible={modalOpen}
                animationType='fade'
                transparent={true}
            >
                <ModalView
                    onPressHandlers={{
                        onUpdateBlog,
                        onDeleteBlog,
                        onCloseModal
                    }}
                    onCloseModal={onCloseModal}
                />
            </Modal>
            <View style={styles.headerBtnContainer}>
                <TouchableOpacity style={styles.createBtn} onPress={() => navigation.navigate('CreateBlog')}
                >
                    <Text style={styles.createText}>Create Blog +</Text>

                </TouchableOpacity>




                <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.header}>
                <Text style={globalStyles.headingText}>My Blogs</Text>
            </View>



            <View style={{ alignItems: 'center' }}>

                {
                    blogs.map((item, index) => <BlogCard
                        key={index}
                        blogData={item}
                        moveToBlogScreen={moveToBlogScreen}
                        onModalOpen={onModalOpen}

                    />)
                }
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    header: {
        marginHorizontal: 10,
        marginVertical: 10
    },
    headerBtnContainer: {

        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    createBtn: {
        backgroundColor: 'purple',
        paddingHorizontal: 20,
        paddingVertical: 5,
        marginTop: 10
    },
    createText: {
        fontSize: 20,
        color: 'white'
    },
    logoutBtn: {

        // backgroundColor: '#ff6666',
        paddingHorizontal: 20,
        paddingVertical: 5,
        justifyContent: 'center',
        alignItems: 'center'

    },

    logoutText: {
        fontSize: 20,
        color: 'blue'
    }

});

export default Home;