import React from 'react';

import { Container, TextH5 } from '../UI';

import { View, Button, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';

export default function ConfirmScreen(props) {
    // this.AppButton.onPress = this.AppButton.onPress.bind(this);
    console.log(props.barcodeList);
    console.log(props.data);
    // console.log(props.route.params);

    React.useEffect(() => {
        console.log('Confirm component mounted');
    }, []);
    //  console.log(props.route.params.data)
    //  console.log(Object.keys(props.route.params))
    // const data = props.route.params.data;
    // const data = props.route.data;

    //  const data = props.route.params.data ?? 'NO QR';
    // const data = Object.keys(props.route.params).map(i => {
    //   return({i.map(j => {
    //     return (
    //       <h1>j</h1>)r
    //   }
    //    )})
    // })

    const AppButton = ({}) => (
        <TouchableOpacity
            onPress={
                navigation.navigate('root', { screen: 'Scanner' })
            
            }
            style={styles.appButtonContainer}
        >
            <Text style={styles.appButtonText}>Styled Button</Text>
        </TouchableOpacity>
    );

    const data = Object.keys(props.barcodeList).map((data) => data.concat());

    //  const data = props.route.params
    // const data = props.route.params?.data;

    return (
        <Container>
            <TextH5>{data}</TextH5>
            <Button
                onPress={() => Alert.alert('Simple Button pressed')}
                title="Test Button"
                color="#841584"
                accessibilityLabel="Learn more about this purple button"
            />

            <AppButton />
        </Container>
    );
}
ConfirmScreen.navigationOptions = {
    title: 'Confirm',
};

const styles = StyleSheet.create({
    // ...
    appButtonContainer: {
        elevation: 8,
        backgroundColor: '#808080',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        position: 'absolute',
        bottom: 40,
    },
    appButtonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
        alignSelf: 'center',
        textTransform: 'uppercase',
    },
});
