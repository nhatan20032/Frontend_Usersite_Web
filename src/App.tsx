import { BrowserPushLifecycle } from './components/notifications/BrowserPushSettings';
import { PreferencesProvider } from './context/PreferencesContext';
import { PublicBookingPage } from './components/appointments/PublicBookingPage';
import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { LanguageProvider } from './context/LanguageContext';
import { LoginPage } from './components/auth/LoginPage';
import { AppLayout } from './components/layout/AppLayout';

const MainContent: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const bookingMatch = window.location.pathname.match(/^\/book\/([^/]+)\/?$/);
  if (bookingMatch) return <PublicBookingPage slug={decodeURIComponent(bookingMatch[1])} />;

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  return <AppLayout />;
};

function App() {
  return (
    <AuthProvider>
      <PreferencesProvider>
      <LanguageProvider>
        <AppProvider>
          <BrowserPushLifecycle />
          <MainContent />
        </AppProvider>
      </LanguageProvider>
      </PreferencesProvider>
    </AuthProvider>
  );
}

export default App;
