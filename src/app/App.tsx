import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { BottomNavigation } from '../components/layout/BottomNavigation';
import { Footer } from '../components/layout/Footer';
import { PwaUpdatePrompt } from '../components/common/PwaUpdatePrompt';
import { AppRouter } from './router';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const App: React.FC = () => {
  const [largeText, setLargeText] = useLocalStorage<boolean>('kine_lca_large_text_pref_v1', false);
  const [darkMode, setDarkMode] = useLocalStorage<boolean>('kine_lca_dark_mode_pref_v1', false);

  useEffect(() => {
    const root = document.documentElement;
    if (largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }
  }, [largeText]);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-brand-bg text-brand-text transition-colors duration-200">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:bg-brand-navy focus:px-4 focus:py-2.5 focus:text-sm focus:font-bold focus:text-white"
        >
          Saltar al contenido principal
        </a>

        <Header
          largeText={largeText}
          onToggleLargeText={() => setLargeText((prev) => !prev)}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode((prev) => !prev)}
        />

        <main id="main-content" className="flex-1 mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          <AppRouter />
        </main>

        <Footer />
        <BottomNavigation />
        <PwaUpdatePrompt />
      </div>
    </BrowserRouter>
  );
};

export default App;
