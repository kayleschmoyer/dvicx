import React from 'react';
import { AuthProvider } from './contexts';
import { LoginScreen } from './screens';

export default function App() {
  return (
    <AuthProvider>
      <LoginScreen />
    </AuthProvider>
  );
}
