
import React, { useState } from 'react';
import { saveToHistory } from '../utils/storage';
import { CalculatorTab } from '../types';

const MurubbaToPiece: React.FC<{ t: any }> = ({ t }) => {
  const [length, setLength] = useState<string>('0.60');
  const [width, setWidth] = useState<string>('0.30');
  const [thickness, setThickness] = useState<string>('3');
  const [murubbaInput, setMurubbaInput] = useState<string>('25');
  const [murubbaRate, setMurubbaRate] = useState<string>('70');
  const [meterRate, setMeterRate] = useState<string>('');
  
  const [result, setResult] = useState<{ 
    pieces: number; 
    meter: number; 
    totalMurubba: number; 
    priceMurubba: number | null;
    priceMeter: number | null;
  } | null>(null);

  const calculate = () => {
    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;
    const m = parseFloat(murubbaInput) || 0;
    const rMur = parseFloat(murubbaRate) || 0;
    const rMet = parseFloat(meterRate) || 0;
    
    if (l > 0 && w > 0 && m > 0) {
      const areaPerPiece = l * w;
      const totalPieces = Math.ceil(m / areaPerPiece);
      const totalMeter = totalPieces * l; 
      
      const pMur = rMur > 0 ? m * rMur : null;
      const pMet = rMet > 0 ? totalMeter * rMet : null;
      
      const calcResults = { pieces: totalPieces, meter: totalMeter, totalMurubba: m, priceMurubba: pMur, priceMeter: pMet };
      setResult(calcResults);

      saveToHistory({
        tabType: CalculatorTab.MURUBBA_TO_PIECE,
        inputs: {
          [t.length]: length,
          [t.width]: width,
          [t.murubba]: murubbaInput
        },
        results: calcResults
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="vertical-bar"></div>
        <h2 className="text-xl font-bold text-[#1e293b]">{t.tabs.murubba}</h2>
      </div>

      <div className="app-card bg-white p-6 border border-slate-100">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-slate-500 text-xs font-bold">{t.length}</label>
            <input
              type="number"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="input-box w-full p-4 outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
          <div className="space-y-1">
            <label className="text-slate-500 text-xs font-bold">{t.width}</label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="input-box w-full p-4 outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
          <div className="space-y-1">
            <label className="text-slate-500 text-xs font-bold">{t.thickness}</label>
            <input
              type="number"
              value={thickness}
              onChange={(e) => setThickness(e.target.value)}
              className="input-box w-full p-4 outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[#006cb4] text-xs font-bold">{t.murubba}</label>
            <input
              type="number"
              value={murubbaInput}
              onChange={(e) => setMurubbaInput(e.target.value)}
              className="input-box w-full p-4 outline-none border-[#006cb4]/20 focus:ring-1 focus:ring-blue-400"
            />
          </div>
          <div className="space-y-1">
            <label className="text-slate-500 text-xs font-bold">{t.rateMur}</label>
            <input
              type="number"
              value={murubbaRate}
              onChange={(e) => setMurubbaRate(e.target.value)}
              placeholder={t.optional}
              className="input-box w-full p-4 outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
          <div className="space-y-1">
            <label className="text-slate-500 text-xs font-bold">{t.rateMet}</label>
            <input
              type="number"
              value={meterRate}
              onChange={(e) => setMeterRate(e.target.value)}
              placeholder={t.optional}
              className="input-box w-full p-4 outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
        </div>

        <button
          onClick={calculate}
          className="w-full mt-6 bg-[#006cb4] text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-blue-100 active:scale-95 transition-all"
        >
          {t.calc} →
        </button>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="vertical-bar"></div>
            <h2 className="text-xl font-bold text-[#1e293b]">{t.result}</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#00a651] text-white p-6 rounded-3xl text-center shadow-lg shadow-green-100">
              <p className="text-[10px] font-bold uppercase mb-2 opacity-80 tracking-widest">{t.totalPcs}</p>
              <div className="text-4xl font-black">{result.pieces}</div>
            </div>
            <div className="bg-white border border-slate-100 p-6 rounded-3xl text-center shadow-sm">
              <p className="text-slate-400 text-[10px] font-bold uppercase mb-2 tracking-widest">{t.totalMet}</p>
              <div className="text-4xl font-black text-[#1e293b]">{result.meter.toFixed(2)}</div>
            </div>

            {result.priceMurubba !== null && (
              <div className="col-span-2 bg-amber-500 text-white p-6 rounded-3xl text-center shadow-lg shadow-amber-100">
                <p className="text-[10px] font-bold uppercase mb-2 opacity-80 tracking-widest">{t.priceMur}</p>
                <div className="text-4xl font-black">{result.priceMurubba.toLocaleString()} <span className="text-lg">৳</span></div>
              </div>
            )}

            {result.priceMeter !== null && (
              <div className="col-span-2 bg-indigo-600 text-white p-6 rounded-3xl text-center shadow-lg shadow-indigo-100">
                <p className="text-[10px] font-bold uppercase mb-2 opacity-80 tracking-widest">{t.priceMet}</p>
                <div className="text-4xl font-black">{result.priceMeter.toLocaleString()} <span className="text-lg">৳</span></div>
              </div>
            )}

            <div className="col-span-2 bg-blue-50 p-4 rounded-2xl text-center border border-blue-100">
               <p className="text-blue-400 text-[10px] font-bold uppercase mb-1 tracking-widest">{t.inputMur}</p>
               <div className="text-2xl font-black text-[#006cb4]">{result.totalMurubba.toFixed(2)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MurubbaToPiece;
