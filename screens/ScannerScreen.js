import React from 'react';

import { Container, Spinner, TextH3 } from '../UI';

import * as Permissions from 'expo-permissions';

import { BarCodeScanner } from 'expo-barcode-scanner';

import layout from '../constants/Layout';
const { window } = layout;

import Confirm from './Confirm';

function delay(time) {
    return new Promise(function(resolve, reject) {
      setTimeout(() => resolve(), time);
    });
  }

class ScannerScreen extends React.Component {
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
        read: null
        
    };
    // This get's called multiple times
  onBarCodeRead = async obj => {
    // Workaround is to add a delay and check if that was already scanned
    await delay(1000000000000);
    if (this.state.read == obj.data) return;
    this.setState({ read: obj.data });
    // Whatever you wanna do with the scanned barcode
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
             barcodeList: [...this.state.barcodeList, this.state.data],
            //  barcodeList: this.state.barcodelist.concat(this.state.data),
            // showConfirmScreen: true

        });

    };
    render() {
        /**
         * TODO:
         *  - If `showConfirmScreen` is true, render a <Confirm /> component and pass in barcodes as a prop
         *     Ex: <Confirm
         */

         <BarCodeScanner
         onBarCodeRead={this.onBarCodeRead}
       />
         if (this.state.showConfirmScreen) {
            return <Confirm barcodeList={this.state.barcodeList} navigation={this.props.navigation} />;
         }

        console.log(this.props);
        console.log(this.state);
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
                    <TextH3>Scan code inside window</TextH3>
                    <BarCodeScanner
                        onBarCodeScanned={
                            isScanned ? undefined : this.handleBarCodeScanned
                        }
                        style={{
                            height: window.height / 4,
                            width: window.height,
                            top: window.height/3
                        }}
                    ></BarCodeScanner>
                </Container>
            );
        } else {
            return <Spinner />;
        }
    }
}

export default ScannerScreen;
