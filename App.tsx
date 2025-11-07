import React from 'react';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ScenariosScreen from './src/screens/ScenariosScreen';
import AgreementScreen from './src/screens/AgreementScreen';
import GenerateOwnScreen from './src/screens/GenerateOwnScreen';
import VerifyScreen from './src/screens/VerifyScreen';

export type RootStackParamList = {
  Scenarios: undefined;
  Agreement: { scenario: string };
  GenerateOwn: undefined;
  Verify: { envelope: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const linking: LinkingOptions<RootStackParamList> = {
    prefixes: [Linking.createURL('/'), 'hotmess://'],
    config: {
      screens: {
        Scenarios: '',
        Agreement: 'agreement',
        GenerateOwn: 'create',
        Verify: {
          path: 'verify',
          parse: { envelope: (v) => `${v}` },
        },
      },
    },
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer linking={linking}>
        <Stack.Navigator>
          <Stack.Screen name="Scenarios" component={ScenariosScreen} options={{ title: 'Pick your scenario' }} />
          <Stack.Screen name="Agreement" component={AgreementScreen} options={{ title: 'Agreement' }} />
          <Stack.Screen name="GenerateOwn" component={GenerateOwnScreen} options={{ title: 'Generate Your Own' }} />
          <Stack.Screen name="Verify" component={VerifyScreen} options={{ title: 'Verify (Parody)' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
