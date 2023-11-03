import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
    primaryInput: {
        width: '80%',
        margin: 10,
        borderBottomWidth: 0.8,
        borderBottomColor: '#4F96EC',
    },
    primaryContainer: {
        backgroundColor: 'white',
        flex: 1
    },
    headingText: {
        fontSize: 36,
        color: 'rgba(0,0,0,0.7)',
        textAlign: 'center'
    },
    primaryText: {
        fontSize: 22,
    },
    secondaryText: {
        fontSize: 18,
        letterSpacing: 0.1,
    },
    primaryTouchableBtn: {
        padding: 10,
        backgroundColor: 'lightgray',
        borderRadius: 7,
        shadowColor: 'gray',
        shadowOffset: {
            width: 1,
            height: 2
        },
        shadowOpacity: 0.5,
        elevation: 5,
    },
    btnText: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center'
    },
    largeBtnText: {
        fontSize: 22,
        color: 'white',
        textAlign: 'center'
    },
    updateBtn: {
        backgroundColor: 'black',

    },
    uploadBtn: {
        backgroundColor: 'purple'
    },

    deleteBtn: {
        backgroundColor: 'black',
    },

    cancelBtn: {
        backgroundColor: 'blue',
    },

})
export default globalStyles;