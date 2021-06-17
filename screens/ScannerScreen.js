import React from 'react';

import { Container, Spinner, TextH3 } from '../UI';

import * as Permissions from 'expo-permissions';

import { BarCodeScanner } from 'expo-barcode-scanner';

import layout from '../constants/Layout';
const { window } = layout;

import Confirm from './Confirm';



class ScannerScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };
    // Component State
    state = {
        hasCameraPermission: null, // if app has permissions to acess camera
        isScanned: false, // scanned
        barcodeList: [],
        // TODO: add a boolean to track whether "Confirm" is showing
        showConfirmScreen: false
        
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
            showConfirmScreen: true

        });
        // TODO: We don't need this anymore since "Confirm" won't be a route, but just a
        // component we render in `ScannerScreen`

        // this.props.navigation.navigate('Root', {
        //     screen: 'Confirm',
        //     params: {
        //         screen: 'Confirm',
        //         params: data,
        //     },
        // });

        //   this.props.navigation.navigate('Root', {
        //     screen: 'Decode',
        //     params: {
        //       screen: 'Decode',
        //       params: totalData
        //     }
        //   });
    };
    render() {
        /**
         * TODO:
         *  - If `showConfirmScreen` is true, render a <Confirm /> component and pass in barcodes as a prop
         *     Ex: <Confirm
         */
         if (this.state.showConfirmScreen) {
            console.log('confirmation screen pop up');
            return <Confirm barcodeList={this.state.barcodeList} />;
         }

        console.log(this.props);
        console.log(this.state);
        const { hasCameraPermission, isScanned } = this.state;

        // for(let i = 0; i < totalData.length; i++){
        //     totalData.push(
        //         <View key = {i}>
        //             <p>test</p>
        //             <TextInput />
        //         </View>
        //     )
        // }

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
                            height: window.height / 2,
                            width: window.height,
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
