/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AppSheetCarousel } from './components/AppSheetCarousel';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { InstagramGallery } from './components/InstagramGallery';
import { LocationAndReviews } from './components/LocationAndReviews';
import { Navbar } from './components/Navbar';

interface ErrorBoundaryState {
  hasError: boolean;
}

class AppErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Render error in La Terminal:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#fcf9f3] text-[#210f07] p-6 text-center">
          <div className="max-w-md space-y-3">
            <h1 className="font-serif text-2xl">Panadería y Confitería La Terminal</h1>
            <p className="text-sm text-[#4f4440]">
              Neuquén 1450, Villa Constitución · Lunes a Lunes 07:00 a 23:00 hs.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-sm font-semibold text-[#fcf9f3] bg-[#9a4523] rounded-lg"
            >
              Recargar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <AppErrorBoundary>
      <div className="min-h-screen flex flex-col bg-[#fcf9f3] text-[#1c1c18]">
        <Navbar />
        <main className="flex-1">
          <HeroSection />
          <AppSheetCarousel />
          <InstagramGallery />
          <LocationAndReviews />
        </main>
        <Footer />
      </div>
    </AppErrorBoundary>
  );
}
