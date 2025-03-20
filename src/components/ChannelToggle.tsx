import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { MessageSquare, Bell, LayoutDashboard, MessageCircle } from 'lucide-react';

interface ChannelToggleProps {
  value: string;
  onValueChange: (value: string) => void;
}

const ChannelToggle: React.FC<ChannelToggleProps> = ({ value, onValueChange }) => {
  return (
    <ToggleGroup.Root
      className="inline-flex bg-gray-100 rounded-lg p-1 gap-1"
      type="single"
      value={value}
      onValueChange={(value) => {
        if (value) onValueChange(value);
      }}
    >
      <ToggleGroup.Item
        className="flex items-center gap-2 px-4 py-2 rounded-md data-[state=on]:bg-white data-[state=on]:shadow-sm transition-all"
        value="sms"
      >
        <MessageSquare className="w-4 h-4" />
        <span>SMS</span>
      </ToggleGroup.Item>
      <ToggleGroup.Item
        className="flex items-center gap-2 px-4 py-2 rounded-md data-[state=on]:bg-white data-[state=on]:shadow-sm transition-all"
        value="push"
      >
        <Bell className="w-4 h-4" />
        <span>Push</span>
      </ToggleGroup.Item>
      <ToggleGroup.Item
        className="flex items-center gap-2 px-4 py-2 rounded-md data-[state=on]:bg-white data-[state=on]:shadow-sm transition-all"
        value="card"
      >
        <LayoutDashboard className="w-4 h-4" />
        <span>Card</span>
      </ToggleGroup.Item>
      <ToggleGroup.Item
        className="flex items-center gap-2 px-4 py-2 rounded-md data-[state=on]:bg-white data-[state=on]:shadow-sm transition-all"
        value="in-app"
      >
        <MessageCircle className="w-4 h-4" />
        <span>In-App</span>
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  );
};

export default ChannelToggle;