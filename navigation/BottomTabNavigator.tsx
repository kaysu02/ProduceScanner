/**
 * Learn more about createBottomTabNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import TabOneScreen from '../screens/TabOneScreen';
import TabTwoScreen from '../screens/TabTwoScreen';
import ScannerScreen from '../screens/ScannerScreen';
import DecodeScreen from '../screens/Decode';
import { BottomTabParamList, TabOneParamList, TabTwoParamList, ScannerScreenParamList, DecodeScreenParamList, ConfirmScreenParamList } from '../types';
import ConfirmScreen from '../screens/Confirm';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Scan"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
      {/* <BottomTab.Screen
        name="Start"
        component={TabOneNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />,
        }}
      /> */}
      {/* <BottomTab.Screen
        name="TabTwo"
        component={TabTwoNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />,
        }}
      /> */}
       <BottomTab.Screen
        name="Scanner"
        component={ScannerScreenNav}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />,
        }}
      />

      {/* <BottomTab.Screen
        name="Confirm"
        component={ConfirmScreenNav}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />,
        }}
        
      /> */}

      <BottomTab.Screen
        name="Cart"
        component={DecodeScreenNav}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabOneStack = createStackNavigator<TabOneParamList>();

function TabOneNavigator() {
  return (
    <TabOneStack.Navigator>
      <TabOneStack.Screen
        name="TabOneScreen"
        component={TabOneScreen}
        options={{ headerTitle: 'Tab One Title' }}
      />
    </TabOneStack.Navigator>
  );
}

const TabTwoStack = createStackNavigator<TabTwoParamList>();

function TabTwoNavigator() {
  return (
    <TabTwoStack.Navigator>
      <TabTwoStack.Screen
        name="TabTwoScreen"
        component={TabTwoScreen}
        options={{ headerTitle: 'Tab Two Title' }}
      />
    </TabTwoStack.Navigator>
  );
}

const ScannerScreenStack = createStackNavigator<ScannerScreenParamList>();

function ScannerScreenNav() {
  return (
    <ScannerScreenStack.Navigator>
      <ScannerScreenStack.Screen
        name="ScannerScreen"
        component={ScannerScreen}
        options={{ headerTitle: 'Scanner' }}
      />
    </ScannerScreenStack.Navigator>
  );
}

const DecodeScreenStack = createStackNavigator<DecodeScreenParamList>();

function DecodeScreenNav() {
  return (
    <DecodeScreenStack.Navigator>
      <DecodeScreenStack.Screen
        name="Decode"
        component={DecodeScreen}
        options={{ headerTitle: 'Decode' }}
      />
    </DecodeScreenStack.Navigator>
  );
}

const ConfirmScreenStack = createStackNavigator<ConfirmScreenParamList>();

function ConfirmScreenNav() {
  return (
    <ConfirmScreenStack.Navigator>
      <ConfirmScreenStack.Screen
        name="Confirm"
        component={ConfirmScreen}
        options={{ headerTitle: 'Confirm' }}
      />
    </ConfirmScreenStack.Navigator>
  );
}
