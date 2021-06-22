import React from 'react';
import { ImageBackground, StyleSheet, View, Text } from "react-native";

// const image = { uri: 'https://reactjs.org/logo-og.png' };

class Home extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              {/* <ImageBackground source={image} style={styles.image}>
              <Text style={styles.text}>Insidegh</Text>
                </ImageBackground> */}
                <ImageBackground
                    source= {require('../assets/images/HomePg-icons.png')}
                    style={{width: '100%', height: '100%'}} >
                    </ImageBackground>

            {/* <Text>Home Screen</Text> */}
            
          </View>
        )
    }
}

// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       flexDirection: 'column',
//     },
//     image: {
//       flex: 1,
//       resizeMode: 'cover',
//       justifyContent: 'center',
//     },
//     text: {
//       color: 'grey',
//       fontSize: 30,
//       fontWeight: 'bold',
//     },
//   });

export default Home;