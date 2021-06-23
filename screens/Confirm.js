import React from 'react';

import { Container, TextH5 } from '../UI';

import { View, Button, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';


export default function ConfirmScreen(props) {
    // this.ScanButton.onPress = this.ScanButton.onPress.bind(this);
    // console.log(props.barcodeList);
    // console.log(props.data);
    // console.log(props.route.params);

    React.useEffect(() => {
        console.log('Confirm component mounted');
    }, []);

    const ScanButton = ({}) => (
        <TouchableOpacity
            onPress={
                () => Alert.alert("Button")
            }
            style={styles.scanButtonContainer}
        >
            <Text style={styles.scanButtonText}>Scan Another Item</Text>
        </TouchableOpacity>
    );

    renderContent = () => {
    return (
        <View style={styles.container}>
            
            {/* <Button
                onPress={() => Alert.alert('Simple Button pressed')}
                title="Test Button"
                color="#841584"
                accessibilityLabel="Learn more about this purple button"
            /> */}
            <ScanButton />
            
            {props.barcodeList.map((upc) => (
                <Text key={upc} style ={styles.list}>{upc}</Text>
            ))}
            {/* <TextH5 >{props.barcodeList.join(', ')}</TextH5> */}
            
        </View>
    );
    };
};

const styles = StyleSheet.create({
    list: {
        paddingTop: 20
        
    },
    container: {
        padding: 50, 
    },
    scanButtonContainer: {
        elevation: 8,
        backgroundColor: '#009FCE',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 12,
        // position: 'absolute',
        // bottom: 40,
    },
    scanButtonText: {
        fontSize: 18,
        color: '#fff',
        alignSelf: 'center',
        textTransform: 'uppercase',
    },
});
