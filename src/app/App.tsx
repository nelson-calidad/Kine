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

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('dark');
    if (largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }
  }, [largeText]);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-void text-bone-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-electric-iris focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
        >
          Saltar al contenido principal
        </a>

        <Header
          largeText={largeText}
          onToggleLargeText={() => setLargeText((prev) => !prev)}
        />

        <main
          id="main-content"
          className="flex-1 mx-auto w-full max-w-7xl px-3.5 py-5 sm:px-6 sm:py-8"
        >
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
