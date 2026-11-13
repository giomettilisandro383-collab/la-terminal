/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppSheetCarousel } from './components/AppSheetCarousel';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { InstagramGallery } from './components/InstagramGallery';
import { LocationAndReviews } from './components/LocationAndReviews';
import { Navbar } from './components/Navbar';

export default function App() {
  return (
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
  );
}
