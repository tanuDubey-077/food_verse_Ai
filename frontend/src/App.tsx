import React, { useState, useEffect } from 'react';
import { NavigationRail } from './components/NavigationRail';
import { TopBar } from './components/TopBar';
import { CommandPalette } from './components/CommandPalette';
import { ProfileModal } from './components/ProfileModal';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { FoodRecognitionPage } from './pages/FoodRecognitionPage';
import { FreshnessPage } from './pages/FreshnessPage';
import { HygienePage } from './pages/HygienePage';
import { CookingAssistantPage } from './pages/CookingAssistantPage';
import { MealPlannerPage } from './pages/MealPlannerPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutPage } from './pages/AboutPage';
import { api } from './services/api';
import { SystemHealth } from './types';
import './styles/spatial.css';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [navCollapsed, setNavCollapsed] = useState<boolean>(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);
  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);
  const [activeProfileName, setActiveProfileName] = useState<string>('Dr. Elena Vance');
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);

  // Poll system health on mount
  useEffect(() => {
    async function checkHealth() {
      try {
        const health = await api.getHealth();
        setSystemHealth(health);
      } catch (err) {
        console.warn("FastAPI backend not reachable at startup:", err);
      }
    }
    checkHealth();
    const timer = setInterval(checkHealth, 15000);
    return () => clearInterval(timer);
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProfileSelect = (name: string, _diet: string, _cals: number) => {
    setActiveProfileName(name);
  };

  const renderActivePage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onEnterWorkspace={(page) => handleNavigate(page || 'dashboard')} />;
      case 'dashboard':
        return (
          <DashboardPage
            onNavigate={handleNavigate}
            systemHealth={systemHealth}
            activeProfileName={activeProfileName}
          />
        );
      case 'food-recognition':
        return <FoodRecognitionPage />;
      case 'freshness':
        return <FreshnessPage />;
      case 'hygiene':
        return <HygienePage />;
      case 'cooking':
        return <CookingAssistantPage />;
      case 'meal-planner':
        return <MealPlannerPage />;
      case 'history':
      case 'reports':
        return <HistoryPage />;
      case 'settings':
        return <SettingsPage />;
      case 'about':
        return <AboutPage />;
      default:
        return (
          <DashboardPage
            onNavigate={handleNavigate}
            systemHealth={systemHealth}
            activeProfileName={activeProfileName}
          />
        );
    }
  };

  return (
    <div className="app-viewport">
      {/* Ambient background spatial glow meshes */}
      <div className="ambient-mesh">
        <div className="glow-orb-1" />
        <div className="glow-orb-2" />
        <div className="glow-orb-3" />
      </div>

      {/* Spatial Navigation Rail */}
      <NavigationRail
        currentPage={currentPage}
        onNavigate={handleNavigate}
        collapsed={navCollapsed}
        onToggleCollapse={() => setNavCollapsed(!navCollapsed)}
        onOpenProfile={() => setProfileModalOpen(true)}
        activeProfileName={activeProfileName}
      />

      {/* Main Viewport */}
      <div className="spatial-main-content">
        <TopBar
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onNavigateLanding={() => handleNavigate('landing')}
          systemHealth={systemHealth}
          activeProfileName={activeProfileName}
          onOpenProfile={() => setProfileModalOpen(true)}
        />

        <main className="spatial-canvas">
          {renderActivePage()}
        </main>
      </div>

      {/* Floating Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* User Profile & Persona Switcher */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        activeProfile={activeProfileName}
        onSelectProfile={handleProfileSelect}
      />
    </div>
  );
};

export default App;
