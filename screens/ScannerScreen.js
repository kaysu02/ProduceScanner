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
    StatusBar,
    FlatList,
    Modal,
    Pressable,
    Alert,
    Image,
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
            weight: Math.round(Math.random() * 100),
            scannedAt: Date.now(),
        };

        if (!barcodeList.length) {
            setBarcodeList([scanData, ...barcodeList]);
            return;
        }

        const mostRecentScan = barcodeList[0];
        const isDuplicateScan = scanData.upc === mostRecentScan.upc;
        
        console.log(scanData)
        console.log(scanData.scannedAt)

        if (isDuplicateScan) {
            /**
             * TODO:
             * 1. Get the timestamp from "scanData" (for our newest item)
             * 2. Get the timestamp from the duplicate item (should be `mostRecentScan` variable)
             * 3. Subtract scanData.scannedAt from mostRecentScan.scannedAt
             * 4. If > 100ms, "return" out of the function to ignore the scan (or give the user an indicator)
             */

            if (scanData.scannedAt - mostRecentScan.scannedAt > 1000 && scanData.scannedAt - mostRecentScan.scannedAt < 5000) {
                console.log(scanData.scannedAt - mostRecentScan.scannedAt)
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
                style={styles.weight}
            >
                {/* <Text style={styles.upc}>{upc}oz</Text> */}
                <Text style={{textAlign: 'center'}}>{weight}oz</Text>
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
                <TouchableOpacity
                style={{alignItems: 'center'}}
                    pointerEvents="none"
                    onPress={() => sheetRef.current.snapTo(1)}
                >
                    <Image
                        style={styles.toggle}
                        source={require('../assets/images/toggle.png')}
                    />
                    <Text style={styles.title}>Weighed Items{'\n'}</Text>
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
                        style={{ textAlign: 'center', paddingVertical: '10%' }}
                    >
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            {/* <Text style={styles.textStyle}>Hide Modal</Text> */}
                            <Image
                                style={styles.img}
                                source={require('../assets/images/exitBtn.png')}
                            />
                        </Pressable>
                        

                        <Text>
                            <Barcode
                                value="value"
                                format="CODE128"
                                style={{
                                    textAlign: 'center',
                                    paddingVertical: '5%',
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
                <Text>{'\n'}</Text>
                <FlatList
                    data={barcodeList}
                    keyExtractor={(item) => `${item.upc}|${item.weight}`}
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
                    snapPoints={[70, 280, 650]}
                    borderRadius={10}
                    enabledInnerScrolling={true}
                    renderContent={renderContent}
                    enabledBottomClamp={true}
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

    return <Spinner />;
}

const styles = StyleSheet.create({
    upc: {
        fontSize: 20,

        textAlign: 'left',
    },
    weight: {
        fontSize: 20,
        margin: '2%',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#D8D8D8',
        borderStyle: 'solid',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: 'white',
        width: 80,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    img: {
        width: 28,
        height: 28,
    },
    toggle: {
        width: 100,
        height: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
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
