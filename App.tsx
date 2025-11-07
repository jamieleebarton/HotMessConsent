import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ScenariosScreen from './src/screens/ScenariosScreen';
import AgreementScreen from './src/screens/AgreementScreen';
import GenerateOwnScreen from './src/screens/GenerateOwnScreen';

export type RootStackParamList = {
  Scenarios: undefined;
  Agreement: { scenario: string };
  GenerateOwn: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Scenarios" component={ScenariosScreen} options={{ title: 'Pick your scenario' }} />
          <Stack.Screen name="Agreement" component={AgreementScreen} options={{ title: 'Agreement' }} />
          <Stack.Screen name="GenerateOwn" component={GenerateOwnScreen} options={{ title: 'Generate Your Own' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

