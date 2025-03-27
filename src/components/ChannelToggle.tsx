import React from 'react';
import { MessageCircle, Bell, Layout, Mail, LayoutDashboard, MessageSquare } from 'lucide-react';

interface ChannelToggleProps {
  value: string;
  onValueChange: (value: string) => void;
}

const ChannelToggle: React.FC<ChannelToggleProps> = ({ value, onValueChange }) => {
  return (
    <div className="inline-flex p-1 space-x-1 bg-white rounded-lg shadow-sm">
      <button
        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          value === 'sms'
            ? 'bg-[#3D1D72] text-white'
            : 'text-gray-600 hover:text-[#3D1D72] hover:bg-gray-100'
        }`}
        onClick={() => onValueChange('sms')}
      >
        <MessageCircle className="w-4 h-4" />
        <span>SMS</span>
      </button>

      <button
        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          value === 'push'
            ? 'bg-[#3D1D72] text-white'
            : 'text-gray-600 hover:text-[#3D1D72] hover:bg-gray-100'
        }`}
        onClick={() => onValueChange('push')}
      >
        <Bell className="w-4 h-4" />
        <span>Push</span>
      </button>

      <button
        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          value === 'email'
            ? 'bg-[#3D1D72] text-white'
            : 'text-gray-600 hover:text-[#3D1D72] hover:bg-gray-100'
        }`}
        onClick={() => onValueChange('email')}
      >
        <Mail className="w-4 h-4" />
        <span>Email</span>
      </button>

      <button
        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          value === 'card'
            ? 'bg-[#3D1D72] text-white'
            : 'text-gray-600 hover:text-[#3D1D72] hover:bg-gray-100'
        }`}
        onClick={() => onValueChange('card')}
      >
        <LayoutDashboard className="w-4 h-4" />
        <span>Card</span>
      </button>

      <button
        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          value === 'in-app'
            ? 'bg-[#3D1D72] text-white'
            : 'text-gray-600 hover:text-[#3D1D72] hover:bg-gray-100'
        }`}
        onClick={() => onValueChange('in-app')}
      >
        <Layout className="w-4 h-4" />
        <span>In-App</span>
      </button>

      <button
        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          value === 'whatsapp'
            ? 'bg-[#3D1D72] text-white'
            : 'text-gray-600 hover:text-[#3D1D72] hover:bg-gray-100'
        }`}
        onClick={() => onValueChange('whatsapp')}
      >
        <MessageSquare className="w-4 h-4" />
        <span>WhatsApp</span>
      </button>
    </div>
  );
};

export default ChannelToggle;