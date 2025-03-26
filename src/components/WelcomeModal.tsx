import React from 'react';
import { X } from 'lucide-react';
import { Wand2 } from 'lucide-react';

// Use current origin in production, fallback to localhost for development
const API_BASE_URL = import.meta.env.PROD 
  ? window.location.origin
  : 'http://localhost:8888';

interface WelcomeModalProps {
  onClose: () => void;
}

export default function WelcomeModal({ onClose }: WelcomeModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-8 max-w-5xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 z-10"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="flex items-center gap-3 mb-8">
          <Wand2 className="w-8 h-8 text-[#3D1D72]" />
          <h2 className="text-2xl font-bold text-[#3D1D72]">Welcome to the Message Preview Generator! 👋</h2>
        </div>
        
        <div className="grid grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="text-3xl font-bold text-[#3D1D72] mb-2">Step 1</div>
            <p className="text-base font-medium text-gray-800 mb-3">
              Get started by entering any brand domain address
            </p>
            <div className="w-full aspect-video rounded-lg shadow-lg overflow-hidden bg-gray-50">
              <img 
                src={`${API_BASE_URL}/step-1.gif`}
                alt="Step 1: Enter brand URL" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="text-3xl font-bold text-[#3D1D72] mb-2">Step 2</div>
            <p className="text-base font-medium text-gray-800 mb-3">
              Brand details will be pulled in automatically, or you can customize them manually
            </p>
            <div className="w-full aspect-video rounded-lg shadow-lg overflow-hidden bg-gray-50">
              <img 
                src={`${API_BASE_URL}/step-2.gif`}
                alt="Step 2: Brand details and content generation" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="text-3xl font-bold text-[#3D1D72] mb-2">Step 3</div>
            <p className="text-base font-medium text-gray-800 mb-3">
              Example messages will automatically be generated for use in prospecting emails or client decks!
            </p>
            <div className="w-full aspect-video rounded-lg shadow-lg overflow-hidden bg-gray-50">
              <img 
                src={`${API_BASE_URL}/step-3a.gif`}
                alt="Step 3: Preview messages" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t mt-8 text-center text-sm text-gray-500">
          built by nick robin 🫡 happy prospecting
        </div>
      </div>
    </div>
  );
} 