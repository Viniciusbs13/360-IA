import { useEffect, useState } from 'react';
import { initSmoothScroll, lockScroll, ScrollTrigger } from '@/lib/motion';
import Loader from '@/components/Loader';
import Nav from '@/components/Nav';
import Scene from '@/components/Scene';
import Hero from '@/components/Hero';
import Modules from '@/components/Modules';
import Method from '@/components/Method';
import About from '@/components/About';
import { Offer, FAQ, Contact, FloatingMobileCTA } from '@/components/Offer';

export default function App() {
  const [entered, setEntered] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const cleanup = initSmoothScroll();
    lockScroll(true);
    window.scrollTo(0, 0);
    return cleanup;
  }, []);

  useEffect(() => {
    if (!entered) return;
    lockScroll(false);
    const t = setTimeout(() => {
      setShowLoader(false);
      ScrollTrigger.refresh();
    }, 50);
    return () => clearTimeout(t);
  }, [entered]);

  return (
    <div className="relative min-h-screen bg-bg text-fg overflow-x-hidden">
      {showLoader && <Loader onEnter={() => setEntered(true)} />}
      <Scene active={entered} />
      <Nav visible={entered} />
      <main>
        <Hero active={entered} />
        <Modules />
        <Method />
        <About />
        <Offer />
        <FAQ />
        <Contact />
      </main>
      <FloatingMobileCTA />
    </div>
  );
}
