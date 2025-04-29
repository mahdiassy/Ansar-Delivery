import React, { useState, useEffect } from 'react';
import { FaTimes, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

const WelcomeTour = ({ userId, onComplete }) => {
  const [showTour, setShowTour] = useState(false);
  const [step, setStep] = useState(0);
  
  const steps = [
    {
      title: "Welcome to 10 Minutes or Less!",
      content: "Let's take a quick tour to help you get started.",
      target: ".page-container"
    },
    {
      title: "Create Requests",
      content: "Click here to create a new ride or delivery request.",
      target: ".btn-primary"
    },
    {
      title: "Track Your Requests",
      content: "All your active and completed requests will appear here.",
      target: ".section-title"
    },
    {
      title: "Chat with Workers",
      content: "Once a worker accepts your request, you can chat with them directly.",
      target: ".card"
    }
  ];
  
  useEffect(() => {
    // Check if user has seen the tour
    const tourSeen = localStorage.getItem(`tour_seen_${userId}`);
    if (!tourSeen) {
      setShowTour(true);
    }
  }, [userId]);
  
  const handleComplete = () => {
    localStorage.setItem(`tour_seen_${userId}`, 'true');
    setShowTour(false);
    if (onComplete) onComplete();
  };
  
  if (!showTour) return null;
  
  const currentStep = steps[step];
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{currentStep.title}</h3>
          <button 
            onClick={handleComplete}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FaTimes />
          </button>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">{currentStep.content}</p>
        
        <div className="flex justify-between">
          <button
            onClick={() => setStep(prev => Math.max(0, prev - 1))}
            disabled={step === 0}
            className={`btn-secondary ${step === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <FaArrowLeft className="mr-2" />
            Previous
          </button>
          
          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep(prev => prev + 1)}
              className="btn-primary"
            >
              Next
              <FaArrowRight className="ml-2" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="btn-primary"
            >
              Get Started
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeTour; 