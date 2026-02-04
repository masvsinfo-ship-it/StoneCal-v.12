import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// --- Types & Constants ---
const Language = { BN: 'bn', EN: 'en', HI: 'hi', AR: 'ar' };
const Tab = { VOLUME: 'VOL', MURUBBA: 'MUR', METER: 'MET', PIECE: 'PCS', HISTORY: 'HIS', AI: 'AI' };

const translations = {
    [Language.BN]: {
        appName: 'পাথরের হিসাব', groupName: 'কারিনা গ্রুপ', calc: 'হিসাব করুন',
        length: 'দৈর্ঘ্য (মি)', width: 'প্রস্থ (মি)', thickness: 'পুরুত্ব (সেমি)',
        pieces: 'পিস', murubba: 'মুরুব্বা', meter: 'মিটার', rateMur: 'দর (মুরুব্বা)',
        rateMet: 'দর (মিটার)', result: 'হিসাবের ফলাফল', totalMur: 'মোট মুরুব্বা',
        totalMet: 'মোট মিটার', totalPcs: 'মোট পিস', priceMur: 'মুরুব্বা দাম',
        priceMet: 'মিটার দাম', totalVol: 'মোট ভলিউম (m³)', inputMur: 'ইনপুট মুরুব্বা',
        optional: 'ঐচ্ছিক', devTitle: 'ডেভেলপার কন্টাক্ট', history: 'হিস্টোরি',
        clearHistory: 'মুছে ফেলুন', noHistory: 'কোন তথ্য নেই',
        aiTitle: 'জেমিনি AI সহকারী'
    },
    [Language.EN]: {
        appName: 'Stone Calc', groupName: 'Carina Group', calc: 'Calculate',
        length: 'Length (m)', width: 'Width (m)', thickness: 'Thickness (cm)',
        pieces: 'Pieces', murubba: 'Murubba', meter: 'Meter', rateMur: 'Rate (Murubba)',
        rateMet: 'Rate (Meter)', result: 'Calculation Result', totalMur: 'Total Murubba',
        totalMet: 'Total Meter', totalPcs: 'Total Pieces', priceMur: 'Price (Mur)',
        priceMet: 'Price (Met)', totalVol: 'Total Vol (m³)', inputMur: 'Input Murubba',
        optional: 'Optional', devTitle: 'Developer Info', history: 'History',
        clearHistory: 'Clear All', noHistory: 'No history',
        aiTitle: 'Gemini AI Assistant'
    }
};

// --- Components ---
const Header = ({ lang, setLang, t }) => {
    return (
        <header className="bg-white px-6 pt-10 pb-4 border-b border-slate-50 sticky top-0 z-50">
            <div className="max-w-md mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#00a651] rounded-xl flex items-center justify-center shadow-lg shadow-green-100">
                        <span className="text-white text-xl">💎</span>
                    </div>
                    <div>
                        <h1 className="text-[#1e293b] font-bold text-lg leading-tight">{t.appName}</h1>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-tighter">{t.groupName}</p>
                    </div>
                </div>
                <button 
                    onClick={() => setLang(lang === Language.BN ? Language.EN : Language.BN)} 
                    className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 font-bold text-xs text-slate-600 active:scale-95 transition-all"
                >
                    {lang === Language.BN ? 'EN 🇺🇸' : 'BN 🇧🇩'}
                </button>
            </div>
        </header>
    );
};

const VolumeCalc = ({ t, onSave }) => {
    const [val, setVal] = useState({ l: '1.0', w: '1.0', t: '3', p: '1', rMur: '', rMet: '' });
    const [res, setRes] = useState(null);

    const calc = () => {
        const l = parseFloat(val.l) || 0;
        const w = parseFloat(val.w) || 0;
        const p = parseFloat(val.p) || 1;
        const thick = parseFloat(val.t) || 0;
        
        const area = l * w * p;
        const vol = area * (thick / 100);
        const met = l * p;
        const pMur = val.rMur ? area * parseFloat(val.rMur) : null;
        const pMet = val.rMet ? met * parseFloat(val.rMet) : null;
        
        const result = { murubba: area, meter: met, volume: vol, pMur, pMet };
        setRes(result);
        onSave('ভলিউম', val, result);
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="app-card p-6 grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">{t.length}</label>
                    <input type="number" value={val.l} onChange={e => setVal({...val, l: e.target.value})} className="input-box w-full p-4" />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">{t.width}</label>
                    <input type="number" value={val.w} onChange={e => setVal({...val, w: e.target.value})} className="input-box w-full p-4" />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">{t.thickness}</label>
                    <input type="number" value={val.t} onChange={e => setVal({...val, t: e.target.value})} className="input-box w-full p-4" />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-green-600 uppercase">{t.pieces}</label>
                    <input type="number" value={val.p} onChange={e => setVal({...val, p: e.target.value})} className="input-box w-full p-4 border-green-100" />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">{t.rateMur}</label>
                    <input type="number" value={val.rMur} onChange={e => setVal({...val, rMur: e.target.value})} placeholder={t.optional} className="input-box w-full p-4" />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">{t.rateMet}</label>
                    <input type="number" value={val.rMet} onChange={e => setVal({...val, rMet: e.target.value})} placeholder={t.optional} className="input-box w-full p-4" />
                </div>
                <button onClick={calc} className="col-span-2 bg-[#00a651] text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-100 active:scale-95 transition-all">{t.calc} →</button>
            </div>
            {res && (
                <div className="grid grid-cols-2 gap-4 animate-fadeIn">
                    <div className="bg-[#00a651] text-white p-6 rounded-3xl text-center shadow-lg shadow-green-50">
                        <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">{t.totalMur}</p>
                        <h3 className="text-3xl font-black">{res.murubba.toFixed(2)}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-3xl text-center border border-slate-100 shadow-sm">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.totalMet}</p>
                        <h3 className="text-3xl font-black text-slate-700">{res.meter.toFixed(2)}</h3>
                    </div>
                    {res.pMur && <div className="col-span-2 bg-amber-500 text-white p-5 rounded-3xl text-center shadow-lg shadow-amber-50">
                        <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">{t.priceMur}</p>
                        <h3 className="text-4xl font-black">{res.pMur.toLocaleString()} <span className="text-lg">৳</span></h3>
                    </div>}
                </div>
            )}
        </div>
    );
};

const GeminiAssistant = ({ t, lang }) => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const ask = async () => {
        if (!prompt.trim()) return;
        setLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const result = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: `Stone Construction Expert context. Language: ${lang}. Question: ${prompt}. Answer clearly and concisely for a mobile app user in Bangladesh.`,
            });
            setResponse(result.text);
        } catch (e) { 
            setResponse('সিস্টেম এরর: অনুগ্রহ করে আবার চেষ্টা করুন।'); 
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4 animate-fadeIn">
            <div className="app-card p-6">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">🤖 {t.aiTitle}</h3>
                <textarea 
                    value={prompt} 
                    onChange={e => setPrompt(e.target.value)} 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm min-h-[100px] outline-none focus:border-blue-400 transition-all" 
                    placeholder="পাথর বা কনস্ট্রাকশন নিয়ে যেকোনো প্রশ্ন করুন..." 
                />
                <button 
                    onClick={ask} 
                    disabled={loading} 
                    className="w-full mt-3 bg-blue-600 text-white py-4 rounded-2xl font-bold active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-blue-50"
                >
                    {loading ? 'ভাবছি...' : 'জিজ্ঞাসা করুন'}
                </button>
            </div>
            {response && (
                <div className="bg-white p-6 rounded-3xl border-l-4 border-blue-500 shadow-sm text-sm text-slate-700 leading-relaxed whitespace-pre-wrap animate-fadeIn">
                    {response}
                </div>
            )}
        </div>
    );
};

const HistoryView = ({ t, history, setHistory }) => (
    <div className="space-y-4 animate-fadeIn">
        <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-slate-800">{t.history} ({history.length})</h3>
            {history.length > 0 && (
                <button onClick={() => setHistory([])} className="text-[10px] font-bold text-red-500 uppercase px-2 py-1 bg-red-50 rounded-lg">
                    {t.clearHistory}
                </button>
            )}
        </div>
        {history.length === 0 ? (
            <div className="text-center py-20 text-slate-300">
                <div className="text-5xl mb-4">📜</div>
                <p className="text-sm font-bold">{t.noHistory}</p>
            </div>
        ) : (
            history.map(item => (
                <div key={item.id} className="app-card p-5 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] font-black bg-green-50 text-green-600 px-2 py-0.5 rounded uppercase tracking-widest">{item.tab}</span>
                        <span className="text-[10px] text-slate-300 font-bold">{item.time}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-600">
                        {item.results.murubba && <div className="bg-slate-50 p-2 rounded-xl text-center">মুরুব্বা: {item.results.murubba.toFixed(2)}</div>}
                        {item.results.meter && <div className="bg-slate-50 p-2 rounded-xl text-center">মিটার: {item.results.meter.toFixed(2)}</div>}
                        {item.results.pcs && <div className="bg-slate-50 p-2 rounded-xl text-center">পিস: {item.results.pcs}</div>}
                    </div>
                </div>
            ))
        )}
    </div>
);

const App = () => {
    const [lang, setLang] = useState(Language.BN);
    const [activeTab, setActiveTab] = useState(Tab.VOLUME);
    const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('stone_history_v2') || '[]'));
    const t = translations[lang] || translations[Language.EN];

    useEffect(() => {
        localStorage.setItem('stone_history_v2', JSON.stringify(history));
    }, [history]);

    const saveHistory = (tab, inputs, results) => {
        const newItem = { id: Date.now(), time: new Date().toLocaleTimeString(), tab, results };
        setHistory(prev => [newItem, ...prev].slice(0, 20));
    };

    const tabs = [
        { id: Tab.VOLUME, icon: '📐', label: t.totalVol },
        { id: Tab.AI, icon: '🤖', label: 'এআই' },
        { id: Tab.HISTORY, icon: '📜', label: t.history }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[#f8fafc]">
            <Header lang={lang} setLang={setLang} t={t} />
            
            <nav className="bg-white border-b border-slate-100 sticky top-[90px] z-40 py-4 shadow-sm overflow-x-auto no-scrollbar">
                <div className="max-w-md mx-auto flex gap-3 px-4">
                    {tabs.map(tab => (
                        <button 
                            key={tab.id} 
                            onClick={() => setActiveTab(tab.id)} 
                            className={`flex items-center gap-2 whitespace-nowrap px-6 py-3 rounded-2xl font-bold text-xs transition-all duration-300 ${
                                activeTab === tab.id 
                                ? 'bg-[#00a651] text-white shadow-lg shadow-green-100 scale-105' 
                                : 'bg-white text-slate-400 border border-slate-100'
                            }`}
                        >
                            <span className="text-sm">{tab.icon}</span> <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </nav>

            <main className="flex-grow max-w-md mx-auto w-full p-5 pb-24">
                {activeTab === Tab.VOLUME && <VolumeCalc t={t} onSave={saveHistory} />}
                {activeTab === Tab.AI && <GeminiAssistant t={t} lang={lang} />}
                {activeTab === Tab.HISTORY && <HistoryView t={t} history={history} setHistory={setHistory} />}
                
                <div className="mt-12 p-8 text-center bg-white rounded-[40px] border border-slate-100 shadow-sm">
                    <p className="text-slate-300 text-[10px] font-bold uppercase tracking-widest mb-4">Developed with ❤️ by Billal</p>
                    <div className="flex justify-center gap-6">
                        <a href="https://fb.com/billal8795" target="_blank" className="w-12 h-12 bg-[#1877f2] text-white rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-blue-100 active:scale-90 transition-all">f</a>
                        <a href="https://wa.me/8801735308795" target="_blank" className="w-12 h-12 bg-[#25d366] text-white rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-green-100 active:scale-90 transition-all">w</a>
                    </div>
                </div>
            </main>
            
            <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-50 py-3 text-center z-50">
                <p className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">Carina Group Stone Solution © 2024</p>
            </footer>
        </div>
    );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);