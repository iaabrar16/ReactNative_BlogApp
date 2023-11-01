import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Modal, Button } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getDocs, collection } from 'firebase/firestore';

import { auth, firestore } from '../../firebaseConfig';

import ModalView from '../../components/ModalView';

import globalStyles from '../../utils/globalStyles';
import BlogCard from '../../components/BlogCard';

const Home = ({ navigation }) => {
    const [blogs, setBlogs] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCardId, setSelectedCardId] = useState([]);

    const getBlogData = async () => {
        try {
            const querySnapshot = await getDocs(collection(firestore, 'usersBlog', auth.currentUser.uid, 'blogs'));
            const data = [];
            querySnapshot.forEach((doc) => {
                data.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            setBlogs(data);
            console.log("data from firebase", data);
        } catch (error) {
            console.error('Error fetching blog data:', error);
        }
    };

    useEffect(() => {
        getBlogData();
    }, []);

    function renderItem({ item }) {
        return (
            <BlogCard
                blogData={item}
                moveToBlogScreen={moveToBlogScreen}
                onModalOpen={onModalOpen}
            />
        );
    }

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
    }
    function onDeleteBlog() {
        setModalOpen(false);
        firestore.collection('usersBlog')
            .doc(auth.currentUser.uid)
            .collection('blogs')
            .doc(selectedCardId)
            .delete()
            .catch((error) => console.log(error));
        setSelectedCardId(null);
    }

    return (
        <View style={globalStyles.primaryContainer}>
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
            <View style={styles.header}>
                <Text style={globalStyles.headingText}>My Blogs</Text>
            </View>
            <View style={styles.addIcon}>
                <Ionicons
                    name='add-circle-sharp'
                    size={54}
                    color='black'
                    onPress={() => navigation.navigate('CreateBlog')}
                />
            </View>

            <View style={{ alignItems: 'center' }}>
                <FlatList
                    data={blogs}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        marginHorizontal: 10,
        marginVertical: 10
    },
    addIcon: {
        position: 'absolute',
        bottom: 20,
        left: '45%',
        zIndex: 1,
        elevation: 20,
    }
});

export default Home;
