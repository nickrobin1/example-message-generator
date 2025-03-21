import { Building2 } from 'lucide-react';
import type { MarketingContent } from '../../types';

export default function PushPreview({ content }: { content: MarketingContent }) {
  return (
    <div className="max-w-sm mx-auto">
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-start gap-3">
          {content.pushIcon ? (
            <img
              src={content.pushIcon}
              alt={content.brandName}
              className="w-12 h-12 rounded-lg"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-gray-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="font-medium text-black">{content.pushTitle || 'Push Title'}</div>
            <p className="text-black mt-1">{content.pushMessage || 'Your message will appear here'}</p>
            <div className="text-black text-sm mt-1">34m ago</div>
          </div>
        </div>
      </div>
    </div>
  );
} 