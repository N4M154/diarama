import React from 'react';
import { Clock, User, X, Scroll } from 'lucide-react';
import type { TownEntry } from '../types/town';

interface LocationStoriesProps {
  location: string;
  locationName: string;
  entries: TownEntry[];
  onClose: () => void;
}

export const LocationStories: React.FC<LocationStoriesProps> = ({
  location,
  locationName,
  entries,
  onClose,
}) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getThemeColor = (theme: string) => {
    const colors: Record<string, string> = {
      'cooking': 'bg-orange-100 text-orange-800',
      'crafts': 'bg-purple-100 text-purple-800',
      'nature': 'bg-green-100 text-green-800',
      'festival': 'bg-pink-100 text-pink-800',
      'seasons': 'bg-blue-100 text-blue-800',
      'mystery': 'bg-gray-100 text-gray-800',
      'community': 'bg-yellow-100 text-yellow-800',
      'animals': 'bg-emerald-100 text-emerald-800',
    };
    return colors[theme] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-green-50">
          <div className="flex items-center gap-3">
            <Scroll className="text-amber-600" size={24} />
            <div>
              <h3 className="text-xl font-serif font-semibold text-gray-900">
                Stories from the {locationName}
              </h3>
              <p className="text-sm text-gray-600">
                {entries.length} {entries.length === 1 ? 'story' : 'stories'} told
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/80 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Stories List */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {entries.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Scroll size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">No stories yet at this location</p>
              <p className="text-sm mt-2">Be the first to chronicle what happens here!</p>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {entries
                .sort((a, b) => b.timestamp - a.timestamp)
                .map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-gradient-to-br from-cream-50 to-amber-50 rounded-lg p-4 border-l-4 border-amber-500 shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Entry Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User size={14} />
                        <span className="font-medium">{entry.author}</span>
                        {entry.isGuest && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                            Guest
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={12} />
                        <span>{formatDate(entry.timestamp)}</span>
                      </div>
                    </div>

                    {/* Entry Content */}
                    <div className="mb-3">
                      <p className="text-gray-800 leading-relaxed font-serif">
                        {entry.content}
                      </p>
                    </div>

                    {/* Themes */}
                    {entry.themes.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {entry.themes.map((theme) => (
                          <span
                            key={theme}
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getThemeColor(theme)}`}
                          >
                            {theme}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};