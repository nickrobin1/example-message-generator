import { Building2 } from 'lucide-react';
import type { MarketingContent } from '../../types';

export default function SMSPreview({ content }: { content: MarketingContent }) {
  return (
    <div className="max-w-sm mx-auto">
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-start gap-3">
          {content.smsIcon ? (
            <img
              src={content.smsIcon}
              alt={content.brandName}
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-gray-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900">{content.brandName || 'Brand Name'}</div>
            <p className="text-gray-600 mt-1">{content.smsMessage || 'Your message will appear here'}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 