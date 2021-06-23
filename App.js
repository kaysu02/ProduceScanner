import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// import BottomDrawer from 'rn-bottom-drawer';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/Home';
import ScannerScreen from './screens/ScannerScreen';
import Confirm from './screens/Confirm';
import btmTab from './screens/btmTab';
// import renderContent from './screens/Confirm';
import { View, Text } from 'react-native';

// const isLoadingComplete = useCachedResources();
// const colorScheme = useColorScheme();

// if (!isLoadingComplete) {
//   return null;
// } else {

// function HomeScreen() {
//   return (

//     document.write("text")

//   );
// }

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Scanner" component={ScannerScreen} />
                <Stack.Screen name="btmTab" component={btmTab} />
                <Stack.Screen name="Confirm" component={Confirm} />
            </Stack.Navigator>
            {/* <BottomDrawer
    containerHeight={30}
    
    offset={10}
  >
    {renderContent()}
  </BottomDrawer> */}
        </NavigationContainer>
    );
}
