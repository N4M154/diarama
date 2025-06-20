import React, { useState, useEffect } from 'react';
import { Plus, Map, BookOpen, Share, Scroll } from 'lucide-react';
import type { TownData, TownEntry } from './types/town';
import { TownMap } from './components/TownMap';
import { TownCrest } from './components/TownCrest';
import { StoryEntry } from './components/StoryEntry';
import { LocationStories } from './components/LocationStories';
import { saveTownData, loadTownData, generateTownId } from './utils/storage';
import { generateTownCrest } from './utils/crestGenerator';
import { generateTownMotto } from './utils/textAnalysis';

// Default town locations mapping
const LOCATION_NAMES: Record<string, string> = {
  'town-square': 'Town Square',
  'bakery': 'Bakery',
  'library': 'Library',
  'park': 'Park',
  'workshop': 'Workshop',
  'theater': 'Theater',
};

function App() {
  const [townData, setTownData] = useState<TownData | null>(null);
  const [showStoryEntry, setShowStoryEntry] = useState(false);
  const [showLocationStories, setShowLocationStories] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [currentView, setCurrentView] = useState<'map' | 'crest'>('map');

  // Initialize or load town data
  useEffect(() => {
    const saved = loadTownData();
    if (saved) {
      setTownData(saved);
    } else {
      // Create new town
      const newTown: TownData = {
        id: generateTownId(),
        name: 'New Town',
        entries: [],
        crest: generateTownCrest([]),
        motto: generateTownMotto([]),
        createdAt: Date.now(),
        lastUpdated: Date.now(),
      };
      setTownData(newTown);
      saveTownData(newTown);
    }
  }, []);

  const handleLocationClick = (locationId: string) => {
    setSelectedLocation(locationId);
    const locationEntries = townData?.entries.filter(e => e.location === locationId) || [];
    
    if (locationEntries.length > 0) {
      setShowLocationStories(true);
    } else {
      setShowStoryEntry(true);
    }
  };

  const handleAddEntry = (entry: TownEntry) => {
    if (!townData) return;

    const updatedEntries = [...townData.entries, entry];
    const updatedTownData: TownData = {
      ...townData,
      entries: updatedEntries,
      crest: generateTownCrest(updatedEntries),
      motto: generateTownMotto(updatedEntries),
      lastUpdated: Date.now(),
    };

    setTownData(updatedTownData);
    saveTownData(updatedTownData);
  };

  const handleChangeTownName = () => {
    if (!townData) return;
    
    const newName = prompt('Enter a new name for your town:', townData.name);
    if (newName && newName.trim() !== townData.name) {
      const updatedTownData = {
        ...townData,
        name: newName.trim(),
        lastUpdated: Date.now(),
      };
      setTownData(updatedTownData);
      saveTownData(updatedTownData);
    }
  };

  const selectedLocationEntries = townData?.entries.filter(e => e.location === selectedLocation) || [];

  if (!townData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Scroll className="mx-auto mb-4 text-amber-600" size={48} />
          <p className="text-lg text-gray-600">Loading your town chronicle...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Scroll className="text-amber-600" size={32} />
              <div>
                <h1 className="text-2xl font-serif font-bold text-gray-900">
                  Tiny Town Chronicle
                </h1>
                <p className="text-sm text-gray-600">
                  Build your town through stories
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setCurrentView('map')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'map'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Map size={16} className="inline mr-1" />
                  Map
                </button>
                <button
                  onClick={() => setCurrentView('crest')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'crest'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <BookOpen size={16} className="inline mr-1" />
                  Crest
                </button>
              </div>

              {/* Share Button (placeholder for future) */}
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white/80 rounded-lg transition-colors">
                <Share size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Primary Content */}
          <div className="lg:col-span-2">
            {currentView === 'map' ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={handleChangeTownName}
                    className="group"
                  >
                    <h2 className="text-3xl font-serif font-bold text-gray-900 group-hover:text-amber-700 transition-colors">
                      {townData.name}
                    </h2>
                    <p className="text-sm text-gray-500 group-hover:text-amber-600">
                      Click to rename
                    </p>
                  </button>
                  
                  <button
                    onClick={() => {
                      setSelectedLocation('town-square');
                      setShowStoryEntry(true);
                    }}
                    className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors shadow-lg"
                  >
                    <Plus size={20} />
                    Add Story
                  </button>
                </div>

                <TownMap
                  townData={townData}
                  onLocationClick={handleLocationClick}
                  selectedLocation={selectedLocation}
                />
              </div>
            ) : (
              <TownCrest townData={townData} />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg p-4 border border-amber-200 shadow-sm">
              <h3 className="font-serif font-semibold text-gray-900 mb-3">
                Town Chronicle
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Stories told:</span>
                  <span className="font-medium">{townData.entries.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Locations with stories:</span>
                  <span className="font-medium">
                    {new Set(townData.entries.map(e => e.location)).size}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Contributors:</span>
                  <span className="font-medium">
                    {new Set(townData.entries.map(e => e.author)).size}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Stories */}
            <div className="bg-white rounded-lg p-4 border border-amber-200 shadow-sm">
              <h3 className="font-serif font-semibold text-gray-900 mb-3">
                Recent Stories
              </h3>
              {townData.entries.length === 0 ? (
                <p className="text-sm text-gray-500 italic">
                  No stories yet. Start chronicling your town!
                </p>
              ) : (
                <div className="space-y-3">
                  {townData.entries
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .slice(0, 3)
                    .map((entry) => (
                      <div
                        key={entry.id}
                        className="border-l-2 border-amber-300 pl-3 cursor-pointer hover:bg-amber-50 rounded-r-md p-2 -ml-2 transition-colors"
                        onClick={() => {
                          setSelectedLocation(entry.location);
                          setShowLocationStories(true);
                        }}
                      >
                        <div className="text-xs text-gray-500 mb-1">
                          {LOCATION_NAMES[entry.location]} • {entry.author}
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {entry.content}
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Help & Tips */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-serif font-semibold text-blue-900 mb-3">
                Chronicle Tips
              </h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Write about seasonal activities to unlock special crests</li>
                <li>• Include cooking, crafts, or festivals for themed entries</li>
                <li>• Create mysteries to earn rare town crests</li>
                <li>• Each story shapes your town's unique character</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {showStoryEntry && (
        <StoryEntry
          location={selectedLocation}
          locationName={LOCATION_NAMES[selectedLocation] || 'Unknown Location'}
          onAddEntry={handleAddEntry}
          onClose={() => {
            setShowStoryEntry(false);
            setSelectedLocation('');
          }}
        />
      )}

      {showLocationStories && (
        <LocationStories
          location={selectedLocation}
          locationName={LOCATION_NAMES[selectedLocation] || 'Unknown Location'}
          entries={selectedLocationEntries}
          onClose={() => {
            setShowLocationStories(false);
            setSelectedLocation('');
          }}
        />
      )}
    </div>
  );
}

export default App;