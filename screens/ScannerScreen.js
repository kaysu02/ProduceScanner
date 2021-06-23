import React from 'react';

import { Container, Spinner, TextH3 } from '../UI';

import * as Permissions from 'expo-permissions';
import BottomSheet from 'reanimated-bottom-sheet';
import { BarCodeScanner } from 'expo-barcode-scanner';
import layout from '../constants/Layout';
const { window } = layout;
import { StatusBar } from 'expo-status-bar';
import Confirm from './Confirm';
import {
    Button,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Header,
} from 'react-native';
import { Alert } from 'react-native';

class ScannerScreen extends React.Component {
    renderContent(props) {
        return (
            <View
                style={{
                    backgroundColor: 'white',
                    padding: 16,
                    height: 450,
                }}
            >
                <Text style={styles.title}>List</Text>
                <Button
                    onPress={() => Alert.alert('pressed')}
                    title="Checkout Barcode"
                    color="#841584"
                />

                {/* {props.barcodeList.map((upc) => (
                <Text key={upc} style ={styles.list}>{upc}</Text>
            ))} */}
            </View>
        );
    }

    renderHeader = () => {
        return (
            <TouchableOpacity
                pointerEvents="none"
                onPress={() => this.sheetRef.current.snapTo(1)}
                
            >
                <Text style={styles.title}>^</Text>
                {/* <Header /> */}
            </TouchableOpacity>
        );
    };

    sheetRef = React.createRef(null);

    static navigationOptions = {
        header: null,
    };
    // Component State
    state = {
        hasCameraPermission: null, // if app has permissions to access camera
        isScanned: false, // scanned
        barcodeList: [],
        // TODO: add a boolean to track whether "Confirm" is showing
        showConfirmScreen: false,
    };

    async componentDidMount() {
        this.props.navigation.addListener('focus', () =>
            this.setState({ isScanned: false }),
        );

        // ask for camera permission
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        console.log(status);
        this.setState({
            hasCameraPermission: status === 'granted' ? true : false,
        });
    }

    handleBarCodeScanned = ({ type, data }) => {
        this.setState({
            /**
             * TODO:
             *  1. Add barcode to list of barcodes in this component's state
             *  2. Set some flag in state for "showConfirmScreen"
             */

            barcodeList: [...this.state.barcodeList, data],

            // showConfirmScreen: true,
        });
    };
    render() {
        const { navigation } = this.props;
        /**
         * TODO:
         *  - If `showConfirmScreen` is true, render a <Confirm /> component and pass in barcodes as a prop
         *     Ex: <Confirm
         */

        if (this.state.showConfirmScreen) {
            return (
                <Confirm
                    barcodeList={this.state.barcodeList}
                    navigation={this.props.navigation}
                />
            );
        }

        console.log(this.props);
        console.log(this.state);
        console.log(Date.now());
        const { hasCameraPermission, isScanned } = this.state;

        if (hasCameraPermission === null) {
            console.log('Requesting permission');
            return <Spinner />;
        }

        if (hasCameraPermission === false) {
            return (
                <Container>
                    <TextH3>Please grant Camera permission</TextH3>
                </Container>
            );
        }
        if (
            hasCameraPermission === true &&
            !isScanned &&
            this.props.navigation.isFocused()
        ) {
            return (
                <Container
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <StatusBar style="dark" />
                    <TextH3>Scan code inside window</TextH3>
                    <BarCodeScanner
                        onBarCodeScanned={
                            isScanned ? undefined : this.handleBarCodeScanned
                        }
                        style={{
                            height: window.height / 4,
                            width: window.height,
                            top: window.height / 3,
                        }}
                    ></BarCodeScanner>

                    {/* <Button
                        onPress={() => this.sheetRef.current.snapTo(1)}
                        title="View List"
                        color="#841584"
                    /> */}
                    <BottomSheet
                        ref={this.sheetRef}
                        snapPoints={[40, 200, 600]}
                        borderRadius={10}
                        
                        renderContent={this.renderContent}
                        renderHeader={this.renderHeader}
                        // onPress={() => this.sheetRef.current.snapTo(2)}
                    />
                </Container>
            );
        } else {
            return <Spinner />;
        }
    }
}

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18
    },
});

export default ScannerScreen;
