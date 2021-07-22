import React, { useState, useEffect, useRef } from 'react';
import Toast from 'react-native-easy-toast';
import Barcode from 'react-native-barcode-svg';
import { Container } from '../UI';
import BottomSheet from 'reanimated-bottom-sheet';
import { BarCodeScanner } from 'expo-barcode-scanner';
import layout from '../constants/Layout';
const { window } = layout;

import {
    ActivityIndicator,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    FlatList,
    Modal,
    Pressable,
    Alert,
    Image,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

const database = {
    '0889893984891': {
        img: '../assets/images/tomato.jpg',
        name: 'Lime',
        weight: 2,
        totalPrice: '1.18',
    },
};
export default function ScannerScreen({ navigation }) {
    const [hasCameraPermission, setCameraPermission] = useState(null);
    const [isScanned, setIsScanned] = useState(false);
    const [barcodeList, setBarcodeList] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const sheetRef = useRef(null);
    const toastRef = useRef(null);

    useEffect(() => {
        // TODO: Check if we need the nav focus listener that was in `componentDidMount`
        const fetchCameraPerms = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setCameraPermission(status === 'granted');
        };
        fetchCameraPerms();
    }, []);

    const handleBarCodeScanned = ({ data }) => {
        /**
         * TODO: Extract PLU/Barcode + Weight from "data" (can use dummy data for weight right now)
         * Can only be done once we have our fake scale product working
         */
        // Example of what should be pushed into `barcodeList` state
        const scanData = {
            upc: data,
            weight: Math.round(Math.random() * 100),
            scannedAt: Date.now(),
        };

        if (!barcodeList.length) {
            setBarcodeList([scanData, ...barcodeList]);
            return;
        }

        const mostRecentScan = barcodeList[0];
        const isDuplicateScan = scanData.upc === mostRecentScan.upc;

        console.log(scanData);
        console.log(scanData.scannedAt);

        if (isDuplicateScan) {
            /**
             * TODO:
             * 1. Get the timestamp from "scanData" (for our newest item)
             * 2. Get the timestamp from the duplicate item (should be `mostRecentScan` variable)
             * 3. Subtract scanData.scannedAt from mostRecentScan.scannedAt
             * 4. If > 100ms, "return" out of the function to ignore the scan (or give the user an indicator)
             */

            if (
                scanData.scannedAt - mostRecentScan.scannedAt > 1000 &&
                scanData.scannedAt - mostRecentScan.scannedAt < 5000
            ) {
                console.log(scanData.scannedAt - mostRecentScan.scannedAt);
                toastRef.current.show(
                    'You have previously scanned this item!',
                    700,
                );
                return;
            }
        }
        if (scanData.scannedAt - mostRecentScan.scannedAt > 5000) {
            setBarcodeList([scanData, ...barcodeList]);
        }
    };

    const rightSwipeActions = () => (
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
                    paddingVertical: 7,
                }}
            >
                Delete
            </Text>
        </View>
    );

    const swipeFromRightOpen = (e) => {
        console.log('swiped right');
        console.log(e);
        const newBarcodeList = barcodeList.filter(
            (item) => !(item.upc === e.upc && item.weight === e.weight),
        );
        setBarcodeList(newBarcodeList);
        console.log(newBarcodeList);
    };

    const ListItem = ({ upc, weight }) => {
        const item = database[upc]
        console.log(upc)
        return (
        <Swipeable
            renderRightActions={rightSwipeActions}
            onSwipeableRightOpen={() => swipeFromRightOpen({ upc, weight })}
        >
            <View
                style={{
                    height: 50,
                    flexDirection: 'row',
                    flexWrap: 'nowrap',
                    margin: 5,
                    backgroundColor: 'white',
                }}
            >
                <View
                    style={{
                        flex: 1.2,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingRight: 20,
                    }}
                >
                    <Image
                        style={styles.produce}
                        source={{uri: item.img}}
                        
                    />
                </View>
                <View
                    style={{
                        flex: 3,
                        justifyContent: 'center',
                        alignItems: 'left',
                    }}
                >
                    <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                </View>
                <View style={styles.weight}>
                    <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
                        {item.weight}oz
                    </Text>
                </View>
            </View>
        </Swipeable>
        );
    };

    const renderContent = () => {
        return (
            <View
                style={{
                    backgroundColor: 'white',
                    padding: 16,
                    height: 700,
                }}
            >
                <TouchableOpacity
                    style={{ alignItems: 'center', marginBottom: 10 }}
                    pointerEvents="none"
                    onPress={() => sheetRef.current.snapTo(1)}
                >
                    <Image
                        style={styles.toggle}
                        source={require('../assets/images/toggle.png')}
                    />
                    <Text style={styles.title}>Weighed Items</Text>
                </TouchableOpacity>

                <Modal
                    presentationStyle="pageSheet"
                    animationType="slide"
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        setModalVisible(!modalVisible);
                    }}
                >
                    <View
                        style={{
                            textAlign: 'center',

                            alignContent: 'center',

                            justifyContent: 'center',
                            textAlign: 'center',
                        }}
                    >
                        <Text
                            style={{
                                alignSelf: 'center',
                                position: 'absolute',
                                top: 25,
                                fontWeight: '700',
                                fontSize: 15,
                            }}
                        >
                            Produce Barcode
                        </Text>

                        <Pressable
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <Image
                                style={{
                                    width: 28,
                                    height: 28,
                                    position: 'absolute',
                                    top: 20,
                                    left: 15,
                                }}
                                source={require('../assets/images/exitBtnBlack.png')}
                            />
                        </Pressable>

                        <Text
                            style={{
                                alignSelf: 'center',
                                alignContent: 'center',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                marginTop: 160,
                                transform: [{ rotate: '90deg' }],
                            }}
                        >
                            <Barcode
                                value="value12344323213423543254325325423fhdkhdbsj"
                                format="CODE128"
                                height={250}
                                maxWidth={window.height / 1.4}
                                singleBarWidth={window.height / 4}
                                style={{
                                    alignSelf: 'center',
                                    alignContent: 'center',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                }}
                            />
                        </Text>
                    </View>
                </Modal>
                <Pressable
                    style={[styles.button, styles.buttonOpen]}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.textStyle}>Checkout Barcode</Text>
                </Pressable>
                <StatusBar />
                <FlatList
                    style={{ marginTop: 10 }}
                    data={barcodeList}
                    keyExtractor={(item) => `${item.upc}|${item.weight}|${item.img}`}
                    renderItem={({ item }) => ListItem(item)}
                    ItemSeparatorComponent={() => (
                        <View style={styles.itemSeparator} />
                    )}
                />
            </View>
        );
    };

    if (hasCameraPermission === null) {
        console.log('Requesting permission');
        return <ActivityIndicator />;
    }

    if (hasCameraPermission === false) {
        return (
            <Container>
                <Text>Please grant Camera permission</Text>
            </Container>
        );
    }

    const shouldShouldScanner =
        hasCameraPermission && !isScanned && navigation.isFocused();
    if (shouldShouldScanner) {
        return (
            <View style={styles.scannerScreen}>
                <View style={styles.upperRect}></View>
                <View style={styles.lowerRect}></View>

                <StatusBar style="dark" />

                <Text style={styles.text}>Scan Produce Weight</Text>
                <Pressable
                    style={{ alignSelf: 'left', zIndex: 2 }}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Image
                        style={{
                            width: 20,
                            height: 20,
                            position: 'absolute',
                            top: 74,
                            left: 15,
                        }}
                        source={require('../assets/images/exitBtnWhite.png')}
                    />
                </Pressable>
                <BarCodeScanner
                    onBarCodeScanned={
                        isScanned ? undefined : handleBarCodeScanned
                    }
                    style={{
                        height: window.height,
                        width: window.height,
                    }}
                ></BarCodeScanner>
                <Text style={styles.btmText}>Center barcode in the frame</Text>
                <BottomSheet
                    ref={sheetRef}
                    snapPoints={[120, 280, 700]}
                    borderRadius={30}
                    enabledInnerScrolling={true}
                    renderContent={renderContent}
                />
                <Toast
                    ref={toastRef}
                    style={{ backgroundColor: 'red' }}
                    position="top"
                    positionValue={50}
                    fadeInDuration={100}
                    fadeOutDuration={50}
                    opacity={0.8}
                    textStyle={{ color: 'black' }}
                ></Toast>
            </View>
        );
    }

    return <ActivityIndicator />;
}

const styles = StyleSheet.create({
    scannerScreen: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: -1,
    },
    upperRect: {
        width: window.width,
        height: 300,
        backgroundColor: 'black',
        opacity: 0.7,
        zIndex: 1,
        position: 'absolute',
        top: 0,
    },
    lowerRect: {
        width: window.width,
        height: 350,
        backgroundColor: 'black',
        opacity: 0.7,
        zIndex: 1,
        position: 'absolute',
        marginTop: 480,
    },
    produce: {
        width: 45,
        height: 45,
    },
    upc: {
        fontSize: 20,

        textAlign: 'left',
    },
    weight: {
        flex: 1,
        fontSize: 20,
        margin: '2%',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#D8D8D8',
        borderStyle: 'solid',
        paddingHorizontal: 10,
        paddingVertical: 7,
        backgroundColor: 'white',
        width: 60,
    },
    img: {
        width: 28,
        height: 28,
    },
    toggle: {
        width: 150,
        height: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
    },
    text: {
        position: 'absolute',
        top: 75,
        fontWeight: '700',
        fontSize: 15,
        zIndex: 2,
        color: 'white',
    },
    btmText: {
        position: 'absolute',
        top: 495,
        fontWeight: '500',
        fontSize: 15,
        color: 'white',
        zIndex: 2,
    },

    itemSeparator: {
        flex: 1,
        height: 1,
        backgroundColor: '#D8D8D8',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },

    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#007DB3',
    },

    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});
