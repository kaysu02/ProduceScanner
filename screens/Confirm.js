import React from 'react';

import { Container, TextH5 } from '../UI';

import { View, Button, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';

export default function ConfirmScreen(props) {
    // this.ScanButton.onPress = this.ScanButton.onPress.bind(this);
    console.log(props.barcodeList);
    console.log(props.data);
    // console.log(props.route.params);

    React.useEffect(() => {
        console.log('Confirm component mounted');
    }, []);


    //  console.log(Object.keys(props.route.params.data))
    //  const data = props.barcodeList ?? 'NO QR';
    const data = Object.keys(props.barcodeList).map((data) => data.concat());


    const ScanButton = ({}) => (
        <TouchableOpacity
            onPress={
                () =>  navigation.navigate('root', { screen: 'Scanner' })
            //    () => Alert.alert("Button")
            }
            style={styles.scanButtonContainer}
        >
            <Text style={styles.scanButtonText}>Scan Another Item</Text>
        </TouchableOpacity>
    );


    return (
        <Container>
            <TextH5>{data}</TextH5>
            <Button
                onPress={() => Alert.alert('Simple Button pressed')}
                title="Test Button"
                color="#841584"
                accessibilityLabel="Learn more about this purple button"
            />

            <ScanButton />
        </Container>
    );
}
ConfirmScreen.navigationOptions = {
    title: 'Confirm',
};

const styles = StyleSheet.create({
    // ...
    scanButtonContainer: {
        elevation: 8,
        backgroundColor: '#808080',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        position: 'absolute',
        bottom: 40,
    },
    scanButtonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
        alignSelf: 'center',
        textTransform: 'uppercase',
    },
});
