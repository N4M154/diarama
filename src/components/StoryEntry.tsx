import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { TownEntry } from '../types/town';
import { generateEntryId } from '../utils/storage';
import { extractThemes } from '../utils/textAnalysis';

interface StoryEntryProps {
  location: string;
  locationName: string;
  onAddEntry: (entry: TownEntry) => void;
  onClose: () => void;
}

export const StoryEntry: React.FC<StoryEntryProps> = ({
  location,
  locationName,
  onAddEntry,
  onClose,
}) => {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;

    setIsSubmitting(true);

    // Simulate a brief delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));

    const themes = extractThemes(content);
    const newEntry: TownEntry = {
      id: generateEntryId(),
      author: author.trim(),
      content: content.trim(),
      location,
      timestamp: Date.now(),
      themes,
    };

    onAddEntry(newEntry);
    setAuthor('');
    setContent('');
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-serif font-semibold text-gray-900">
              Add a Story
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              to the {locationName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Chronicle Keeper"
              maxLength={50}
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Town Story
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
              placeholder="Tell us about a townsfolk and their daily life at this location..."
              rows={6}
              maxLength={500}
              required
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {content.length}/500 characters
            </div>
          </div>

          {/* Tips */}
          <div className="bg-amber-50 rounded-md p-3 border border-amber-200">
            <h4 className="text-sm font-medium text-amber-800 mb-1">Writing Tips:</h4>
            <ul className="text-xs text-amber-700 space-y-1">
              <li>• Mention seasonal activities for special crests</li>
              <li>• Include cooking, crafts, or festivals for unique themes</li>
              <li>• Create mysteries to unlock rare town crests</li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!author.trim() || !content.trim() || isSubmitting}
              className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Adding...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Add Story
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};