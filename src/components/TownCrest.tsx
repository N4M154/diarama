import React from 'react';
import { Shield, Star, Award } from 'lucide-react';
import type { TownData } from '../types/town';
import { getCrestRarity, getUnlockedCrestInfo } from '../utils/crestGenerator';

interface TownCrestProps {
  townData: TownData;
}

export const TownCrest: React.FC<TownCrestProps> = ({ townData }) => {
  const rarity = getCrestRarity(townData.entries);
  const unlockedCrests = getUnlockedCrestInfo(townData.entries);
  
  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'text-gray-600',
      uncommon: 'text-green-600',
      rare: 'text-blue-600',
      legendary: 'text-purple-600'
    };
    return colors[rarity as keyof typeof colors] || 'text-gray-600';
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return <Award className="text-purple-600" size={16} />;
      case 'rare': return <Star className="text-blue-600" size={16} />;
      case 'uncommon': return <Shield className="text-green-600" size={16} />;
      default: return <Shield className="text-gray-600" size={16} />;
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 border-2 border-amber-200 shadow-lg">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
          {townData.name}
        </h2>
        
        {/* Town Crest */}
        <div className="bg-gradient-to-br from-amber-50 to-cream-100 rounded-lg p-6 mb-4 border border-amber-300">
          <pre className="text-sm font-mono text-gray-800 leading-tight whitespace-pre">
            {townData.crest}
          </pre>
        </div>

        {/* Rarity Badge */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {getRarityIcon(rarity)}
          <span className={`font-medium capitalize ${getRarityColor(rarity)}`}>
            {rarity} Crest
          </span>
        </div>

        {/* Town Motto */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="text-gray-600 text-sm uppercase tracking-wide mb-1">
            Town Motto
          </p>
          <p className="font-serif text-lg text-gray-900 italic">
            "{townData.motto}"
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <div className="text-2xl font-bold text-green-700">
              {townData.entries.length}
            </div>
            <div className="text-sm text-green-600">
              Stories Told
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
            <div className="text-2xl font-bold text-purple-700">
              {unlockedCrests.length}
            </div>
            <div className="text-sm text-purple-600">
              Crests Unlocked
            </div>
          </div>
        </div>

        {/* Town Info */}
        <div className="mt-4 text-xs text-gray-500 space-y-1">
          <div>Founded: {new Date(townData.createdAt).toLocaleDateString()}</div>
          <div>Last Updated: {new Date(townData.lastUpdated).toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  );
};