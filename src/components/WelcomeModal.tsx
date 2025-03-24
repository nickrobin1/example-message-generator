import React from 'react';
import { X } from 'lucide-react';

interface WelcomeModalProps {
  onClose: () => void;
}

export default function WelcomeModal({ onClose }: WelcomeModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-2xl font-bold text-[#3D1D72] mb-4">Welcome to the Message Preview Generator! 👋</h2>
        
        <div className="space-y-4 text-gray-600">
          <p>
            Create beautiful message mockups in seconds with our new preview tool. This is our MVP release, and we're excited to have you try it out!
          </p>
          
          <p className="font-medium">Getting Started:</p>
          
          <ul className="list-disc pl-5 space-y-2">
            <li>Simply enter a domain name and we'll try to automatically fetch info about that brand</li>
            <li>Or manually customize your brand details if you prefer</li>
            <li>Preview messages across all channels: SMS, Push, Email, Cards, and In-App</li>
            <li>Generate AI-powered content with just one click</li>
          </ul>
          
          <p>
            Got ideas to make this better? Click the feedback button in the bottom right - we'd love to hear from you!
          </p>
          
          <p>
            Want to contribute to the project? Find us on{' '}
            <a
              href="https://github.com/nickrobin1/example-message-generator"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3D1D72] hover:underline font-medium"
            >
              GitHub
            </a>
            .
          </p>

          <div className="pt-4 border-t mt-4 text-center text-sm text-gray-500">
            built by nick robin 🫡 happy prospecting
          </div>
        </div>
      </div>
    </div>
  );
} 