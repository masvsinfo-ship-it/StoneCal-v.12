import React, { useState, useEffect } from 'react';
import { CalculatorTab, Language } from './types';
import { translations } from './translations';
import Header from './components/Header';
import VolumeCalculator from './components/VolumeCalculator';
import MurubbaToPiece from './components/MurubbaToPiece';
import MeterToPiece from './components/MeterToPiece';
import PieceToAll from './components/PieceToAll';
import History from './components/History';
import DeveloperInfo from './components/DeveloperInfo';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CalculatorTab>(CalculatorTab.VOLUME);
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('stone_calc_lang') as Language) || Language.BN;
  });

  useEffect(() => {
    localStorage.setItem('stone_calc_lang', lang);
  }, [lang]);

  const t = translations[lang];
  const isRTL = lang === Language.AR;

  const renderContent = () => {
    switch (activeTab) {
      case CalculatorTab.VOLUME:
        return <VolumeCalculator t={t} />;
      case CalculatorTab.MURUBBA_TO_PIECE:
        return <MurubbaToPiece t={t} />;
      case CalculatorTab.METER_TO_PIECE:
        return <MeterToPiece t={t} />;
      case CalculatorTab.PIECE_TO_ALL:
        return <PieceToAll t={t} />;
      case CalculatorTab.HISTORY:
        return <History t={t} />;
      default:
        return <VolumeCalculator t={t} />;
    }
  };

  const tabs = [
    { id: CalculatorTab.VOLUME, label: t.tabs.volume, icon: '📐' },
    { id: CalculatorTab.MURUBBA_TO_PIECE, label: t.tabs.murubba, icon: '🧱' },
    { id: CalculatorTab.METER_TO_PIECE, label: t.tabs.meter, icon: '📏' },
    { id: CalculatorTab.PIECE_TO_ALL, label: t.tabs.piece, icon: '🔢' },
    { id: CalculatorTab.HISTORY, label: t.tabs.history, icon: '📜' },
  ];

  return (
    <div className={`min-h-screen flex flex-col bg-[#f8fafc] ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Header currentLang={lang} onLangChange={setLang} t={t} />

      {/* Navigation Tab Bar */}
      <nav className="bg-white border-b border-slate-100 sticky top-[105px] z-40 py-4 shadow-sm overflow-x-auto no-scrollbar">
        <div className="max-w-md mx-auto flex gap-3 px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-200 ${
                activeTab === tab.id 
                  ? 'bg-[#00a651] text-white shadow-lg shadow-green-100 scale-105' 
                  : 'bg-white text-slate-500 border border-slate-100'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-grow max-w-md mx-auto w-full px-5 py-8">
        <div className="animate-fadeIn">
          {renderContent()}
          <DeveloperInfo t={t} />
        </div>
      </main>

      <footer className="bg-white/50 backdrop-blur-sm py-4 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest border-t border-slate-50">
        Carina Group Stone Solution © 2024
      </footer>
    </div>
  );
};

export default App;