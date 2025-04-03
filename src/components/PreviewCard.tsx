interface PreviewCardProps {
  title: string;
  message: string;
  brandName: string;
  brandColor: string;
}

export default function PreviewCard({ title, message, brandName, brandColor }: PreviewCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      <div className="flex items-center gap-3 mb-3">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-sm text-gray-600">{message}</p>
    </div>
  );
} 