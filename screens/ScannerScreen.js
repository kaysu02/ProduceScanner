import React from 'react';

import { Container, Spinner, TextH3 } from '../UI';

import * as Permissions from 'expo-permissions';
import BottomSheet from 'reanimated-bottom-sheet';
import { BarCodeScanner } from 'expo-barcode-scanner';
import layout from '../constants/Layout';
const { window } = layout;
// import { StatusBar } from 'expo-status-bar';
import Confirm from './Confirm';
import btmTab from './btmTab';
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

class ScannerScreen extends React.Component {
    // todoList = [
    //     { id: '1', text: 'Learn JavaScript' },
    //     { id: '2', text: 'Learn React' },
    //     { id: '3', text: 'Learn TypeScript' },
    // ];
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
                    backgroundColor: '#ff8303',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                }}
            >
                <Text
                    style={{
                        color: '#1b1a17',
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
    swipeFromRightOpen = () => {
        alert('Swipe from right');
    };
    ListItem = ({ text }) => (
        <Swipeable
            renderLeftActions={this.LeftSwipeActions}
            renderRightActions={this.rightSwipeActions}
            onSwipeableRightOpen={this.swipeFromRightOpen}
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
                    {text}
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
                    <FlatList
                        data={this.state.barcodeList}
                        keyExtractor={(item) => Object.keys(item)}
                        renderItem={({ item }) => this.ListItem(item)}
                        ItemSeparatorComponent={this.Separator}
                    />
                </SafeAreaView>

                {/* {this.state.barcodeList.map((upc) => (
                    <Text key={upc} style={styles.list}>
                        {upc}
                    </Text>
                ))} */}

                {/* <ScrollView vertical={true} enabledInnerScrolling={true}>
                    <TouchableOpacity activeOpacity={1}>
                        <Text>{this.state.barcodeList}</Text>
                    </TouchableOpacity>
                </ScrollView> */}
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
    state = {
        hasCameraPermission: null, // if app has permissions to access camera
        isScanned: false, // scanned
        barcodeList: [],
        // TODO: add a boolean to track whether "Confirm" is showing
        
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
        this.setState({
            /**
             * TODO:
             *  1. Add barcode to list of barcodes in this component's state
             *  2. Set some flag in state for "showConfirmScreen"
             */

            barcodeList: [data, ...this.state.barcodeList],

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
                        onPress={navigation.navigate(btmTab)}
                        title="Swipe screen"
                        color="#841584"
                    /> */}
                    <BottomSheet
                        ref={this.sheetRef}
                        snapPoints={[40, 200, 600]}
                        borderRadius={10}
                        renderHeader={this.renderHeader}
                        enabledInnerScrolling={true}
                        renderContent={this.renderContent}
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
        fontSize: 18,
    },
    container: {
        flex: 1,
    },
    itemSeparator: {
        flex: 1,
        height: 1,
        backgroundColor: '#444',
    },
});

export default ScannerScreen;
