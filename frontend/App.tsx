import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, AuthContext, ThemeProvider, SyncProvider } from './contexts';
import { MechanicSelectScreen, WorkOrdersScreen, InspectionScreen } from './screens';
import VehicleVerificationScreen from './screens/VehicleVerificationScreen';
import InspectionSummaryScreen from './screens/InspectionSummaryScreen';
import CustomerReportScreen from './screens/CustomerReportScreen';

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { mechanicId } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {mechanicId ? (
          <>
            <Stack.Screen name="WorkOrders" component={WorkOrdersScreen} />
            <Stack.Screen name="VehicleVerification" component={VehicleVerificationScreen} />
            <Stack.Screen name="Inspection" component={InspectionScreen} />
            <Stack.Screen name="InspectionSummary" component={InspectionSummaryScreen} />
            <Stack.Screen name="CustomerReport" component={CustomerReportScreen} />
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
