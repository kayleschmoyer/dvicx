import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, AuthContext, ThemeProvider, SyncProvider } from './contexts';
import { MechanicSelectScreen, WorkOrdersScreen, InspectionScreen } from './screens';

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { mechanicId } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {mechanicId ? (
          <>
            <Stack.Screen name="WorkOrders" component={WorkOrdersScreen} />
            <Stack.Screen name="Inspection" component={InspectionScreen} />
          </>
        ) : (
          <Stack.Screen
            name="SelectMechanic"
            component={MechanicSelectScreen}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SyncProvider>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </SyncProvider>
    </ThemeProvider>
  );
}
