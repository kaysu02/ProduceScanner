import React from 'react';
import {
    ImageBackground,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';


class Home extends React.Component {
    render() {
        const { navigation } = this.props;
        return (
            <View>
                <StatusBar style="light" />

                <ImageBackground
                    source={require('../assets/images/home.png')}
                    style={{ width: '100%', height: '100%', zIndex: '-1' }}
                >
                    <TouchableOpacity
                    style={styles.button}
                        onPress={() => {
                            navigation.navigate('Scanner');
                        }}
                    >
                        <Image
                            style={styles.img}
                            source={require('../assets/images/produceBtn.png')}
                        />
                    </TouchableOpacity>
                </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    img : {
        width: 28,
        height: 28
    },
    button: {
      borderRadius: 20,
      marginBottom: 20,
      position: 'absolute',
      left:     246,
      top:      56,
    },
  });

export default Home;
