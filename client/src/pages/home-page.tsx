import React from 'react';
import MainLayout from '@/components/layout/main-layout';
import HeroSection from '@/components/home/hero-section';
import { motion } from 'framer-motion';

const HomePage = () => {
  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <HeroSection />
        
        {/* Additional content sections will be added here */}
      </motion.div>
    </MainLayout>
  );
};

export default HomePage;