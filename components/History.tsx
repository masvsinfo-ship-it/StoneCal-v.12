
import React, { useState, useEffect } from 'react';
import { getHistory, deleteHistoryItem, clearAllHistory } from '../utils/storage';
import { HistoryItem, CalculatorTab } from '../types';

interface HistoryProps {
  t: any;
}

const History: React.FC<HistoryProps> = ({ t }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleDelete = (id: string) => {
    deleteHistoryItem(id);
    setHistory(getHistory());
  };

  const handleClear = () => {
    if (window.confirm(t.clearHistory + '?')) {
      clearAllHistory();
      setHistory([]);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getTabLabel = (tab: CalculatorTab) => {
    switch (tab) {
      case CalculatorTab.VOLUME: return t.tabs.volume;
      case CalculatorTab.MURUBBA_TO_PIECE: return t.tabs.murubba;
      case CalculatorTab.METER_TO_PIECE: return t.tabs.meter;
      case CalculatorTab.PIECE_TO_ALL: return t.tabs.piece;
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="vertical-bar"></div>
          <h2 className="text-xl font-bold text-[#1e293b]">{t.history}</h2>
        </div>
        {history.length > 0 && (
          <button 
            onClick={handleClear}
            className="text-[10px] font-bold text-red-500 uppercase tracking-widest bg-red-50 px-3 py-1.5 rounded-full border border-red-100 active:scale-95 transition-all"
          >
            {t.clearHistory}
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="app-card bg-white p-12 text-center border border-slate-100 flex flex-col items-center gap-4">
          <div className="text-4xl opacity-20">📜</div>
          <p className="text-slate-400 font-bold">{t.noHistory}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="app-card bg-white p-5 border border-slate-100 relative group animate-fadeIn">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-[10px] font-black uppercase text-[#00a651] bg-green-50 px-2 py-0.5 rounded shadow-sm">
                    {getTabLabel(item.tabType)}
                  </span>
                  <p className="text-[10px] text-slate-400 font-medium mt-1">{formatDate(item.timestamp)}</p>
                </div>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  {Object.entries(item.inputs).map(([key, val]) => (
                    <div key={key} className="flex justify-between text-[11px] border-b border-slate-50 pb-0.5 last:border-0">
                      <span className="text-slate-400 font-medium">{key}:</span>
                      <span className="text-slate-600 font-bold">{val}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-slate-50 p-2 rounded-xl flex flex-col justify-center gap-1 border border-slate-100">
                  {item.results.murubba !== undefined && (
                    <div className="text-center">
                      <p className="text-[8px] font-black uppercase text-slate-400 leading-none">{t.totalMur}</p>
                      <p className="text-lg font-black text-[#00a651]">{item.results.murubba.toFixed(2)}</p>
                    </div>
                  )}
                  {item.results.pieces !== undefined && (
                    <div className="text-center">
                      <p className="text-[8px] font-black uppercase text-slate-400 leading-none">{t.totalPcs}</p>
                      <p className="text-lg font-black text-blue-600">{item.results.pieces}</p>
                    </div>
                  )}
                  {item.results.totalMeter !== undefined && (
                    <div className="text-center">
                      <p className="text-[8px] font-black uppercase text-slate-400 leading-none">{t.totalMet}</p>
                      <p className="text-lg font-black text-amber-600">{item.results.totalMeter.toFixed(2)}</p>
                    </div>
                  )}
                  {(item.results.priceMurubba || item.results.priceMeter) && (
                     <div className="text-center border-t border-slate-200 mt-1 pt-1">
                        <p className="text-[9px] font-black text-[#1e293b]">
                          { (item.results.priceMurubba || item.results.priceMeter).toLocaleString() } ৳
                        </p>
                     </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
