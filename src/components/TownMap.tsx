import React from 'react';
import { MapPin, Home, Coffee, Book, TreePine, Hammer, Music } from 'lucide-react';
import type { TownData, TownLocation } from '../types/town';

interface TownMapProps {
  townData: TownData;
  onLocationClick: (location: string) => void;
  selectedLocation?: string;
}

const TOWN_LOCATIONS: TownLocation[] = [
  { id: 'town-square', name: 'Town Square', x: 50, y: 50, entries: [], icon: 'home' },
  { id: 'bakery', name: 'Bakery', x: 25, y: 30, entries: [], icon: 'coffee' },
  { id: 'library', name: 'Library', x: 75, y: 25, entries: [], icon: 'book' },
  { id: 'park', name: 'Park', x: 20, y: 70, entries: [], icon: 'tree' },
  { id: 'workshop', name: 'Workshop', x: 80, y: 65, entries: [], icon: 'hammer' },
  { id: 'theater', name: 'Theater', x: 50, y: 80, entries: [], icon: 'music' },
];

const getLocationIcon = (iconType: string) => {
  const iconMap = {
    home: Home,
    coffee: Coffee,
    book: Book,
    tree: TreePine,
    hammer: Hammer,
    music: Music,
  };
  
  const IconComponent = iconMap[iconType as keyof typeof iconMap] || MapPin;
  return IconComponent;
};

export const TownMap: React.FC<TownMapProps> = ({ 
  townData, 
  onLocationClick, 
  selectedLocation 
}) => {
  // Count entries per location
  const locationCounts = townData.entries.reduce((acc, entry) => {
    acc[entry.location] = (acc[entry.location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-gradient-to-br from-amber-50 to-green-50 rounded-lg p-8 border-2 border-amber-200 shadow-lg">
      <div className="relative w-full h-96 bg-cream-100 rounded-lg border border-amber-300 overflow-hidden">
        {/* Map Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" className="text-amber-600">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)"/>
          </svg>
        </div>

        {/* Town Name */}
        <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1 border border-amber-300">
          <h3 className="font-serif text-lg text-amber-900 font-semibold">
            {townData.name}
          </h3>
        </div>

        {/* Locations */}
        {TOWN_LOCATIONS.map((location) => {
          const IconComponent = getLocationIcon(location.icon);
          const entryCount = locationCounts[location.id] || 0;
          const isSelected = selectedLocation === location.id;
          
          return (
            <button
              key={location.id}
              onClick={() => onLocationClick(location.id)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 group transition-all duration-200 ${
                isSelected 
                  ? 'scale-110 z-20' 
                  : 'hover:scale-105 z-10'
              }`}
              style={{
                left: `${location.x}%`,
                top: `${location.y}%`,
              }}
            >
              {/* Location Marker */}
              <div className={`relative p-3 rounded-full shadow-lg transition-all duration-200 ${
                isSelected
                  ? 'bg-amber-500 text-white shadow-xl'
                  : entryCount > 0
                    ? 'bg-green-500 text-white shadow-lg hover:bg-green-600'
                    : 'bg-white text-gray-600 shadow-md hover:bg-gray-50'
              }`}>
                <IconComponent size={20} />
                
                {/* Entry Count Badge */}
                {entryCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center font-bold">
                    {entryCount}
                  </div>
                )}
              </div>

              {/* Location Name Tooltip */}
              <div className={`absolute top-full mt-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                isSelected ? 'opacity-100' : ''
              }`}>
                <div className="bg-gray-900 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
                  {location.name}
                  {entryCount > 0 && (
                    <span className="ml-1 text-green-300">
                      ({entryCount} {entryCount === 1 ? 'story' : 'stories'})
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Map Legend */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 mb-2">Click locations to view or add stories</p>
        <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Has stories</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <span>Empty location</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <span>Selected</span>
          </div>
        </div>
      </div>
    </div>
  );
};