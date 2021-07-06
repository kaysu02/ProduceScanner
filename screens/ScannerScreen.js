import React from 'react';
import Toast, { DURATION } from 'react-native-easy-toast';

import { Container, Spinner } from '../UI';
import { RootSiblingParent } from 'react-native-root-siblings';

import * as Permissions from 'expo-permissions';
import BottomSheet from 'reanimated-bottom-sheet';
import { BarCodeScanner } from 'expo-barcode-scanner';
import layout from '../constants/Layout';
const { window } = layout;
// import { StatusBar } from 'expo-status-bar';
import Confirm from './Confirm';
import btmTab from './btmTab';
import * as Notifications from 'expo-notifications';
import {
    Button,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    FlatList,
} from 'react-native';
import { Alert } from 'react-native';
import {
    ScrollView,
    NativeViewGestureHandler,
    Swipeable,
} from 'react-native-gesture-handler';

// // Add a Toast on screen.
// let toast = Toast.show('Request failed to send.', {
//     duration: Toast.durations.LONG,
//   });

//   // You can manually hide the Toast, or it will automatically disappear after a `duration` ms timeout.
//   setTimeout(function hideToast() {
//     Toast.hide(toast);
//   }, 500);

class ScannerScreen extends React.Component {
    Separator = () => <View style={styles.itemSeparator} />;

    LeftSwipeActions = () => {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#ccffbd',
                    justifyContent: 'center',
                }}
            >
                <Text
                    style={{
                        color: '#40394a',
                        paddingHorizontal: 10,
                        fontWeight: '600',
                        paddingHorizontal: 30,
                        paddingVertical: 20,
                    }}
                >
                    Bookmark
                </Text>
            </View>
        );
    };
    rightSwipeActions = () => {
        return (
            <View
                style={{
                    backgroundColor: '#EE3124',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    flex: 1,
                }}
            >
                <Text
                    style={{
                        color: '#FFFFFF',
                        paddingHorizontal: 10,
                        fontWeight: '600',
                        paddingHorizontal: 30,
                        paddingVertical: 20,
                    }}
                >
                    Delete
                </Text>
            </View>
        );
    };
    swipeFromLeftOpen = () => {
        alert('Swipe from left');
    };
    swipeFromRightOpen = (e) => {
        console.log('swiped right');
        console.log(e);
        this.setState({
            barcodeList: this.state.barcodeList.filter(
                (item) => !(item.upc === e.upc && item.weight === e.weight),
            ),
        });
        console.log(this.state.barcodeList);
    };

    ListItem = ({ upc, weight }) => (
        <Swipeable
            renderLeftActions={this.LeftSwipeActions}
            renderRightActions={this.rightSwipeActions}
            onSwipeableRightOpen={() =>
                this.swipeFromRightOpen({ upc, weight })
            }
            onSwipeableLeftOpen={this.swipeFromLeftOpen}
        >
            <View
                style={{
                    paddingHorizontal: 30,
                    paddingVertical: 20,
                    backgroundColor: 'white',
                }}
            >
                <Text style={{ fontSize: 24 }} style={{ fontSize: 20 }}>
                    {upc}, {weight}oz
                </Text>
            </View>
        </Swipeable>
    );

    renderContent = () => {
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

                <StatusBar />
                <SafeAreaView style={styles.container}>
                    {/* <Text style={{ textAlign: 'center', marginVertical: 20 }}>
                        Swipe right or left
                    </Text> */}

                    <FlatList
                        data={this.state.barcodeList}
                        keyExtractor={(item) => `${item.upc}|${item.weight}`}
                        renderItem={({ item }) => this.ListItem(item)}
                        ItemSeparatorComponent={this.Separator}
                    />
                </SafeAreaView>
            </View>
        );
    };

    renderHeader = () => {
        return (
            <TouchableOpacity
                pointerEvents="none"
                onPress={() => this.sheetRef.current.snapTo(1)}
            >
                <Text style={styles.title}>^</Text>
            </TouchableOpacity>
        );
    };

    sheetRef = React.createRef(null);

    static navigationOptions = {
        header: null,
    };
    // Component State
    /**
     * TODO: Update `barcodeList` to hold objects instead of just barcodes.
     * For example, each entry in `barcodeList` should have UPC/PLU + weight
     */
    state = {
        hasCameraPermission: null, // if app has permissions to access camera
        isScanned: false, // scanned
        barcodeList: [],
        // barcodeList: [{
        //     plu: 387240837402,
        //     weight: 12
        // }]
        // TODO: add a boolean to track whether "Confirm" is showing
        showConfirmScreen: false,
    };

    async componentDidMount() {
        this.props.navigation.addListener('focus', () =>
            this.setState({ isScanned: false }),
        );

        // ask for camera permission
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            hasCameraPermission: status === 'granted' ? true : false,
        });
    }

    handleBarCodeScanned = ({ type, data }) => {
        /**
         * TODO: Extract PLU/Barcode + Weight from "data" (can use dummy data for weight right now)
         * Can only be done once we have our fake scale product working
         */
        // Example of what should be pushed into `barcodeList` state

        const scanData = {
            upc: data,
            weight: Math.round(Math.random() * 1000),
            scannedAt: Date.now(),
        };

        // Handle first item in the list. No prior record to worry about duplicates for
        if (!this.state.barcodeList.length) {
            this.setState({
                barcodeList: [scanData, ...this.state.barcodeList],
            });
            return;
        }

        // we now know we have at least 1 item in our list

        const mostRecentScan = this.state.barcodeList[0];
        // TODO: Weight comparison commented out for now, because dupe scans would never
        // have matching weights, so there would never be a "duplicate"
        const isDuplicateScan = scanData.upc === mostRecentScan.upc;

        if (isDuplicateScan) {
            /**
             * TODO:
             * 1. Get the timestamp from "scanData" (for our newest item)
             * 2. Get the timestamp from the duplicate item (should be `mostRecentScan` variable)
             * 3. Subtract scanData.scannedAt from mostRecentScan.scannedAt
             * 4. If > 100ms, "return" out of the function to ignore the scan (or give the user an indicator)
             */
            if (mostRecentScan.scannedAt - scanData.scannedAt < 100) {
                this.toast.show('You have previously scanned this item!', 200);

                // <Toast visible={this.state.visible}>Test</Toast>
                // if (this.alertPresent == false){
                // Alert.alert(
                //     '',
                //     'You have recently added the same item',
                //     [
                //         {
                //             text: 'Add Anyways',
                //             onPress: () => {
                //                 this.setState({
                //                     barcodeList: [
                //                         scanData,
                //                         ...this.state.barcodeList,
                //                     ],
                //                 });
                //             },
                //         },

                //         {
                //             text: 'Cancel',
                //             onPress: () => {
                //                 return;
                //             },
                //         }
                //     ],

                // );
                //     this.alertPresent = true;
                // }
            }
            return;
        }

        this.setState({
            barcodeList: [scanData, ...this.state.barcodeList],
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

        const { hasCameraPermission, isScanned } = this.state;

        if (hasCameraPermission === null) {
            console.log('Requesting permission');
            return <Spinner />;
        }

        if (hasCameraPermission === false) {
            return (
                <Container>
                    <Text>Please grant Camera permission</Text>
                </Container>
            );
        }
        if (
            hasCameraPermission === true &&
            !isScanned &&
            this.props.navigation.isFocused()
        ) {
            return (
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',

                        alignItems: 'center',
                    }}
                >
                    <StatusBar style="dark" />
                    <Text style={styles.text}>Scan code inside window</Text>
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

                    <BottomSheet
                        ref={this.sheetRef}
                        snapPoints={[100, 280, 650]}
                        borderRadius={10}
                        renderHeader={this.renderHeader}
                        enabledInnerScrolling={true}
                        renderContent={this.renderContent}
                    />
                    <Toast
                        ref={(toast) => (this.toast = toast)}
                        style={{ backgroundColor: 'red' }}
                        position="top"
                        positionValue={50}
                        fadeInDuration={100}
                        fadeOutDuration={50}
                        opacity={0.8}
                        textStyle={{ color: 'black' }}
                    />
                </View>
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
        fontSize: 18,
    },
    text: {
        position: 'absolute',
        top: 200,
    },

    itemSeparator: {
        flex: 1,
        height: 1,
        backgroundColor: '#444',
    },
});

export default ScannerScreen;
