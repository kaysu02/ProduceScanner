import React, { useState, useEffect, useRef } from 'react';
import Toast from 'react-native-easy-toast';
import Barcode from 'react-native-barcode-svg';
import { Container, Spinner } from '../UI';
import * as Permissions from 'expo-permissions';
import BottomSheet from 'reanimated-bottom-sheet';
import { BarCodeScanner } from 'expo-barcode-scanner';
import layout from '../constants/Layout';
const { window } = layout;

import {
    Button,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    FlatList,
    Modal,
    Pressable,
    Alert,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

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
            const { status } = await Permissions.askAsync(Permissions.CAMERA);
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
            weight: Math.round(Math.random() * 1000),
            scannedAt: Date.now(),
        };

        if (!barcodeList.length) {
            setBarcodeList([scanData, ...barcodeList]);
            return;
        }

        const mostRecentScan = barcodeList[0];
        const isDuplicateScan = scanData.upc === mostRecentScan.upc;

        if (isDuplicateScan) {
            /**
             * TODO:
             * 1. Get the timestamp from "scanData" (for our newest item)
             * 2. Get the timestamp from the duplicate item (should be `mostRecentScan` variable)
             * 3. Subtract scanData.scannedAt from mostRecentScan.scannedAt
             * 4. If > 100ms, "return" out of the function to ignore the scan (or give the user an indicator)
             */
            if (mostRecentScan.scannedAt - scanData.scannedAt < 2000) {
                toastRef.current.show(
                    'You have previously scanned this item!',
                    700,
                );
                return;
            }
        }

        setBarcodeList([scanData, ...barcodeList]);
    };

    const renderHeader = () => {
        return (
            <TouchableOpacity
                pointerEvents="none"
                onPress={() => sheetRef.current.snapTo(1)}
            >
                <Text style={styles.title}>^</Text>
            </TouchableOpacity>
        );
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
                    paddingVertical: 20,
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

    const ListItem = ({ upc, weight }) => (
        <Swipeable
            renderRightActions={rightSwipeActions}
            onSwipeableRightOpen={() => swipeFromRightOpen({ upc, weight })}
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

    const renderContent = () => {
        return (
            <View
                style={{
                    backgroundColor: 'white',
                    padding: 16,
                    height: 450,
                }}
            >
                <Text style={styles.title}>List</Text>
                <Modal
                    presentationStyle="fullScreen"
                    animationType="slide"
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        setModalVisible(!modalVisible);
                    }}
                >
                    <View>
                        <Text>
                            Hello World!
                            <Barcode value="Hello World" format="CODE128" />;
                        </Text>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <Text style={styles.textStyle}>Hide Modal</Text>
                        </Pressable>
                    </View>
                </Modal>
                <Pressable
                    style={[styles.button, styles.buttonOpen]}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.textStyle}>Checkout Barcode</Text>
                </Pressable>
                <StatusBar />
                <SafeAreaView style={styles.container}>
                    <FlatList
                        data={barcodeList}
                        keyExtractor={(item) => `${item.upc}|${item.weight}`}
                        renderItem={({ item }) => ListItem(item)}
                        ItemSeparatorComponent={() => (
                            <View style={styles.itemSeparator} />
                        )}
                    />
                </SafeAreaView>
            </View>
        );
    };

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

    const shouldShouldScanner =
        hasCameraPermission && !isScanned && navigation.isFocused();
    if (shouldShouldScanner) {
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
                        isScanned ? undefined : handleBarCodeScanned
                    }
                    style={{
                        height: window.height / 4,
                        width: window.height,
                        top: window.height / 3,
                    }}
                ></BarCodeScanner>
                <BottomSheet
                    ref={sheetRef}
                    snapPoints={[100, 280, 650]}
                    borderRadius={10}
                    renderHeader={renderHeader}
                    enabledInnerScrolling={true}
                    renderContent={renderContent}
                />
                <Toast>
                    ref={toastRef}
                    style={{ backgroundColor: 'red' }}
                    position="top" positionValue={50}
                    fadeInDuration={100}
                    fadeOutDuration={50}
                    opacity={0.8}
                    textStyle={{ color: 'black' }}
                </Toast>
            </View>
        );
    }

    return <Spinner />;
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
        backgroundColor: '#D8D8D8',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    //   modalView: {
    //     margin: 20,
    //     backgroundColor: "white",
    //     borderRadius: 20,
    //     padding: 35,
    //     alignItems: "center",
    //     shadowColor: "#000",
    //     shadowOffset: {
    //       width: 0,
    //       height: 2
    //     },
    //     shadowOpacity: 0.25,
    //     shadowRadius: 4,
    //     elevation: 5
    //   },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
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
