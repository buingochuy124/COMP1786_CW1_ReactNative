import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TripListScreen from './AppScreens/TripList.screen';
import AddTripScreen from './AppScreens/AddTrip.screen';
import UpdateTripScreen from './AppScreens/UpdateTrip.screen';

const Stack = createStackNavigator();

const AppNavigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="TripListScreen"
                    component={TripListScreen}
                />
                <Stack.Screen
                    name="AddTripScreen"
                    component={AddTripScreen}
                />
                <Stack.Screen
                    name="UpdateTripScreen"
                    component={UpdateTripScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigation;