import React, { useState, useEffect } from 'react';
import { Plus, Map, BookOpen, Share, Scroll, LogIn, User, LogOut } from 'lucide-react';
import type { TownData, TownEntry } from './types/town';
import { TownMap } from './components/TownMap';
import { TownCrest } from './components/TownCrest';
import { StoryEntry } from './components/StoryEntry';
import { LocationStories } from './components/LocationStories';
import { AuthModal } from './components/Auth/AuthModal';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { townsAPI, storiesAPI } from './services/api';

// Default town locations mapping
const LOCATION_NAMES: Record<string, string> = {
  'town-square': 'Town Square',
  'bakery': 'Bakery',
  'library': 'Library',
  'park': 'Park',
  'workshop': 'Workshop',
  'theater': 'Theater',
};

function AppContent() {
  const { user, logout, loading: authLoading } = useAuth();
  const [townData, setTownData] = useState<TownData | null>(null);
  const [stories, setStories] = useState<TownEntry[]>([]);
  const [showStoryEntry, setShowStoryEntry] = useState(false);
  const [showLocationStories, setShowLocationStories] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [currentView, setCurrentView] = useState<'map' | 'crest'>('map');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load user's first town or create a new one
  useEffect(() => {
    const loadTownData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        console.log('Loading town data for user:', user.username);
        const response = await townsAPI.getMyTowns();
        console.log('User towns response:', response);
        
        if (response.towns.length > 0) {
          // Load the first town
          const town = response.towns[0];
          console.log('Loading town with shareId:', town.shareId);
          const townResponse = await townsAPI.getTownByShareId(town.shareId);
          console.log('Town data loaded:', townResponse.town);
          setTownData(townResponse.town);
          setStories(townResponse.stories || []);
        } else {
          // Create a new town
          console.log('Creating new town for user');
          const newTownResponse = await townsAPI.createTown('My First Town');
          console.log('New town created:', newTownResponse.town);
          setTownData(newTownResponse.town);
          setStories([]);
        }
      } catch (err: any) {
        console.error('Error loading town data:', err);
        setError(err.response?.data?.message || 'Failed to load town data');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      loadTownData();
    }
  }, [user, authLoading]);

  const handleLocationClick = (locationId: string) => {
    setSelectedLocation(locationId);
    const locationEntries = stories.filter(e => e.location === locationId) || [];
    
    if (locationEntries.length > 0) {
      setShowLocationStories(true);
    } else {
      setShowStoryEntry(true);
    }
  };

  const handleAddEntry = async (entry: Omit<TownEntry, 'id' | 'timestamp'>) => {
    if (!townData) {
      console.error('No town data available');
      setError('No town data available');
      return;
    }

    try {
      console.log('Adding story to town:', townData.name, 'with ID:', townData.id);
      console.log('Story data:', entry);

      const storyData = {
        author: entry.author,
        content: entry.content,
        location: entry.location,
        townId: townData.id, // Make sure we're sending the town ID
      };

      console.log('Sending story data to API:', storyData);

      const response = await storiesAPI.addStory(storyData);
      console.log('Story added successfully:', response);

      // Reload town data to get updated crest and motto
      const townResponse = await townsAPI.getTownByShareId(townData.shareId);
      setTownData(townResponse.town);
      setStories(townResponse.stories || []);
      
      console.log('Town data refreshed after adding story');
    } catch (err: any) {
      console.error('Error adding story:', err);
      setError(err.response?.data?.message || 'Failed to add story');
    }
  };

  const handleChangeTownName = async () => {
    if (!townData || !user) return;
    
    const newName = prompt('Enter a new name for your town:', townData.name);
    if (newName && newName.trim() !== townData.name) {
      try {
        const response = await townsAPI.updateTown(townData.id, {
          name: newName.trim(),
        });
        setTownData(response.town);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to update town name');
      }
    }
  };

  const selectedLocationEntries = stories.filter(e => e.location === selectedLocation) || [];

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Scroll className="mx-auto mb-4 text-amber-600" size={48} />
          <p className="text-lg text-gray-600">Loading your town chronicle...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-green-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-amber-200">
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

              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
              >
                <LogIn size={20} />
                Sign In
              </button>
            </div>
          </div>
        </header>

        {/* Welcome Content */}
        <main className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="mb-8">
            <Scroll className="mx-auto mb-6 text-amber-600" size={64} />
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
              Welcome to Tiny Town Chronicle
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Create unique text-based towns by writing stories about fictional townsfolk. 
              Each story shapes your town's identity and unlocks special crests.
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700 transition-colors text-lg font-medium"
            >
              Start Your Chronicle
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-amber-200">
              <BookOpen className="mx-auto mb-4 text-amber-600" size={48} />
              <h3 className="text-xl font-serif font-semibold mb-2">Write Stories</h3>
              <p className="text-gray-600">
                Create short entries about fictional townsfolk and their daily lives
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-amber-200">
              <Map className="mx-auto mb-4 text-amber-600" size={48} />
              <h3 className="text-xl font-serif font-semibold mb-2">Build Your Town</h3>
              <p className="text-gray-600">
                Watch your town grow as stories are linked to different locations
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-amber-200">
              <Share className="mx-auto mb-4 text-amber-600" size={48} />
              <h3 className="text-xl font-serif font-semibold mb-2">Share & Collaborate</h3>
              <p className="text-gray-600">
                Share your town with others and let them add their own stories
              </p>
            </div>
          </div>
        </main>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => {
                setError('');
                window.location.reload();
              }}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!townData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Scroll className="mx-auto mb-4 text-amber-600" size={48} />
          <p className="text-lg text-gray-600">Setting up your town...</p>
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

            <div className="flex items-center gap-4">
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

              {/* User Menu */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User size={16} />
                  <span>{user.username}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white/80 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={20} />
                </button>
              </div>
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
                  townData={{...townData, entries: stories}}
                  onLocationClick={handleLocationClick}
                  selectedLocation={selectedLocation}
                />
              </div>
            ) : (
              <TownCrest townData={{...townData, entries: stories}} />
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
                  <span className="font-medium">{stories.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Locations with stories:</span>
                  <span className="font-medium">
                    {new Set(stories.map(e => e.location)).size}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Contributors:</span>
                  <span className="font-medium">
                    {new Set(stories.map(e => e.author)).size}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Stories */}
            <div className="bg-white rounded-lg p-4 border border-amber-200 shadow-sm">
              <h3 className="font-serif font-semibold text-gray-900 mb-3">
                Recent Stories
              </h3>
              {stories.length === 0 ? (
                <p className="text-sm text-gray-500 italic">
                  No stories yet. Start chronicling your town!
                </p>
              ) : (
                <div className="space-y-3">
                  {stories
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

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;