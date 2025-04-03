import React from 'react';
import { Building2 } from 'lucide-react';
import { MarketingContent } from '../../types';

interface CardPreviewProps {
  content: MarketingContent;
}

export const CardPreview: React.FC<CardPreviewProps> = ({ content }) => {
  return (
    <div className="w-full max-w-sm rounded-2xl bg-white shadow-sm">
      <div className="relative h-64 w-full overflow-hidden rounded-t-2xl bg-gray-50">
        {content.cardImage ? (
          <img
            src={content.cardImage}
            alt="Card preview"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-center">
              <Building2 className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-2 text-sm text-gray-400">Add an image URL to preview</p>
            </div>
          </div>
        )}
      </div>
      <div className="p-6">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          {content.cardTitle || 'Special Offer'}
        </h2>
        <p className="text-base text-gray-600">
          {content.cardDescription || 'Discover our latest collection and enjoy exclusive member benefits.'}
        </p>
      </div>
    </div>
  );
}; 