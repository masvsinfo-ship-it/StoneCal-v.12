import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// Languages & Types
enum Language { BN = 'bn', EN = 'en' }
enum Tab { CALC = 'calc', AI = 'ai', HISTORY = 'history' }

const translations = {
  [Language.BN]: {
    nav: { home: 'মূল পাতা', calculator: 'ক্যালকুলেটর', ai: 'এআই সহকারী', history: 'হিস্টোরি' },
    hero: { title: 'পাথর পরিমাপের সহজ সমাধান', subtitle: 'কারিনা গ্রুপ ডিজিটাল ক্যালকুলেটরে স্বাগতম' },
    labels: {
      length: 'দৈর্ঘ্য (মিটার)', width: 'প্রস্থ (মিটার)', thick: 'পুরুত্ব (সেমি)', pieces: 'পিস সংখ্যা',
      rate: 'মুরুব্বা দর (টাকা)', murubba: 'মোট মুরুব্বা', meter: 'মোট মিটার', result: 'হিসাবের ফলাফল',
      totalPrice: 'মোট দাম', calcBtn: 'হিসাব সম্পন্ন করুন', reset: 'নতুন হিসাব'
    },
    sections: {
      vol: 'ভলিউম ও মুরুব্বা ক্যালকুলেটর',
      murToPcs: 'মুরুব্বা থেকে পিস',
      metToPcs: 'মিটার থেকে পিস',
      pcsToAll: 'পিস থেকে মুরুব্বা/মিটার'
    }
  },
  [Language.EN]: {
    nav: { home: 'Home', calculator: 'Calculator', ai: 'AI Assistant', history: 'History' },
    hero: { title: 'Stone Measurement Simplified', subtitle: 'Welcome to Carina Group Digital Solution' },
    labels: {
      length: 'Length (m)', width: 'Width (m)', thick: 'Thickness (cm)', pieces: 'No. of Pieces',
      rate: 'Rate per Murubba', murubba: 'Total Murubba', meter: 'Total Meter', result: 'Calculation Result',
      totalPrice: 'Total Price', calcBtn: 'Calculate Now', reset: 'Reset'
    },
    sections: {
      vol: 'Volume & Murubba Calculator',
      murToPcs: 'Murubba to Piece',
      metToPcs: 'Meter to Piece',
      pcsToAll: 'Piece to All'
    }
  }
};

const App = () => {
  const [lang, setLang] = useState<Language>(Language.BN);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.CALC);
  const [history, setHistory] = useState<any[]>(() => {
    const saved = localStorage.getItem('stone_portal_history');
    return saved ? JSON.parse(saved) : [];
  });

  const t = translations[lang];

  useEffect(() => {
    localStorage.setItem('stone_portal_history', JSON.stringify(history));
  }, [history]);

  const addHistory = (type: string, data: any) => {
    const newItem = {
      id: Date.now(),
      type,
      data,
      timestamp: new Date().toLocaleString()
    };
    setHistory(prev => [newItem, ...prev].slice(0, 30));
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#00a651] rounded-2xl flex items-center justify-center shadow-lg shadow-green-100">
              <span className="text-white text-2xl">💎</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-slate-800 leading-tight">কারিনা গ্রুপ</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Digital Solution</p>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-8">
            <button 
              onClick={() => setActiveTab(Tab.CALC)}
              className={`text-sm font-bold transition-all px-2 py-6 ${activeTab === Tab.CALC ? 'tab-active' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {t.nav.calculator}
            </button>
            <button 
              onClick={() => setActiveTab(Tab.AI)}
              className={`text-sm font-bold transition-all px-2 py-6 ${activeTab === Tab.AI ? 'tab-active' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {t.nav.ai}
            </button>
            <button 
              onClick={() => setActiveTab(Tab.HISTORY)}
              className={`text-sm font-bold transition-all px-2 py-6 ${activeTab === Tab.HISTORY ? 'tab-active' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {t.nav.history}
            </button>
            <button 
              onClick={() => setLang(lang === Language.BN ? Language.EN : Language.BN)}
              className="ml-4 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all"
            >
              {lang === Language.BN ? 'English' : 'বাংলা'}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      {activeTab === Tab.CALC && (
        <section className="bg-[#00a651] py-12 px-4 text-white text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black mb-4 animate-fade">{t.hero.title}</h2>
            <p className="text-green-50 text-lg opacity-90">{t.hero.subtitle}</p>
          </div>
        </section>
      )}

      {/* Main Content Area */}
      <main className="flex-grow max-w-6xl mx-auto w-full p-4 sm:p-8">
        <div className="animate-fade">
          {activeTab === Tab.CALC && <CalculatorPortal t={t} onSave={addHistory} lang={lang} />}
          {activeTab === Tab.AI && <AIPortal t={t} lang={lang} />}
          {activeTab === Tab.HISTORY && <HistoryPortal t={t} history={history} setHistory={setHistory} />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 mt-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-center text-center md:text-left">
          <div>
            <h3 className="text-2xl font-black mb-2">কারিনা গ্রুপ</h3>
            <p className="text-slate-400 text-sm">পাথর সরবরাহ ও নির্মাণ শিল্পের বিশ্বস্ত নাম।</p>
          </div>
          <div className="flex flex-col items-center gap-4">
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Developer Contact</p>
             <div className="flex gap-4">
                <a href="https://wa.me/8801735308795" className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform">W</a>
                <a href="https://fb.com/billal8795" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform">F</a>
             </div>
          </div>
          <div className="text-slate-400 text-xs">
            © 2024 Carina Group Digital Portal. <br/> All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- Portal Components ---

const CalculatorPortal = ({ t, onSave, lang }: any) => {
  const [activeSubTab, setActiveSubTab] = useState('vol');
  
  const subTabs = [
    { id: 'vol', label: t.sections.vol, icon: '📏' },
    { id: 'mur', label: t.sections.murToPcs, icon: '🧱' },
    { id: 'met', label: t.sections.metToPcs, icon: '📐' },
    { id: 'pcs', label: t.sections.pcsToAll, icon: '🔢' }
  ];

  return (
    <div className="space-y-8">
      {/* Sub-navigation for Calculators */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {subTabs.map(st => (
          <button 
            key={st.id} 
            onClick={() => setActiveSubTab(st.id)}
            className={`whitespace-nowrap px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeSubTab === st.id ? 'bg-[#00a651] text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-200'}`}
          >
            <span>{st.icon}</span> {st.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        {activeSubTab === 'vol' && <VolumeCalculator t={t} onSave={onSave} />}
        {activeSubTab === 'mur' && <MurubbaToPieceCalculator t={t} onSave={onSave} />}
        {activeSubTab === 'met' && <MeterToPieceCalculator t={t} onSave={onSave} />}
        {activeSubTab === 'pcs' && <PieceToAllCalculator t={t} onSave={onSave} />}
      </div>
    </div>
  );
};

// -- Individual Calculator Logic --

const VolumeCalculator = ({ t, onSave }: any) => {
  const [inputs, setInputs] = useState({ l: '1', w: '1', t: '3', p: '1', rate: '' });
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const l = parseFloat(inputs.l) || 0;
    const w = parseFloat(inputs.w) || 0;
    const th = parseFloat(inputs.t) || 0;
    const p = parseFloat(inputs.p) || 1;
    const r = parseFloat(inputs.rate) || 0;

    const murubba = l * w * p;
    const meter = l * p;
    const volume = murubba * (th / 100);
    const price = r > 0 ? murubba * r : null;

    const res = { murubba, meter, volume, price };
    setResult(res);
    onSave(t.sections.vol, res);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <div className="web-card p-8 space-y-6">
        <h3 className="text-xl font-bold border-l-4 border-[#00a651] pl-4">{t.sections.vol}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputGroup label={t.labels.length} value={inputs.l} onChange={v => setInputs({...inputs, l: v})} />
          <InputGroup label={t.labels.width} value={inputs.w} onChange={v => setInputs({...inputs, w: v})} />
          <InputGroup label={t.labels.thick} value={inputs.t} onChange={v => setInputs({...inputs, t: v})} />
          <InputGroup label={t.labels.pieces} value={inputs.p} onChange={v => setInputs({...inputs, p: v})} />
          <div className="sm:col-span-2">
             <InputGroup label={t.labels.rate} value={inputs.rate} onChange={v => setInputs({...inputs, rate: v})} />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary w-full">{t.labels.calcBtn}</button>
      </div>

      {result && (
        <div className="space-y-4 animate-fade">
          <h3 className="text-xl font-bold text-slate-800">{t.labels.result}</h3>
          <div className="grid grid-cols-2 gap-4">
            <ResultCard label={t.labels.murubba} value={result.murubba.toFixed(2)} color="bg-green-600" />
            <ResultCard label={t.labels.meter} value={result.meter.toFixed(2)} color="bg-slate-800" />
            {result.price && (
              <div className="col-span-2 bg-blue-600 text-white p-8 rounded-3xl text-center shadow-xl">
                 <p className="text-xs font-bold uppercase opacity-80 mb-2 tracking-widest">{t.labels.totalPrice}</p>
                 <h4 className="text-5xl font-black">{result.price.toLocaleString()} <span className="text-xl">৳</span></h4>
              </div>
            )}
            <div className="col-span-2 bg-slate-100 p-4 rounded-xl text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
              Volume: {result.volume.toFixed(3)} m³
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MurubbaToPieceCalculator = ({ t, onSave }: any) => {
  const [inputs, setInputs] = useState({ l: '0.60', w: '0.30', m: '25' });
  const [res, setRes] = useState<number | null>(null);

  const calculate = () => {
    const p = Math.ceil(parseFloat(inputs.m) / (parseFloat(inputs.l) * parseFloat(inputs.w)));
    setRes(p);
    onSave(t.sections.murToPcs, { pieces: p, murubba: inputs.m });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="web-card p-8 space-y-6">
        <h3 className="text-xl font-bold border-l-4 border-blue-600 pl-4">{t.sections.murToPcs}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputGroup label={t.labels.length} value={inputs.l} onChange={v => setInputs({...inputs, l: v})} />
          <InputGroup label={t.labels.width} value={inputs.w} onChange={v => setInputs({...inputs, w: v})} />
          <div className="sm:col-span-2">
            <InputGroup label={t.labels.murubba} value={inputs.m} onChange={v => setInputs({...inputs, m: v})} />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary w-full bg-blue-600">{t.labels.calcBtn}</button>
      </div>
      {res && (
        <div className="bg-blue-600 text-white p-12 rounded-[40px] flex flex-col items-center justify-center shadow-2xl shadow-blue-100 text-center animate-fade">
           <p className="text-sm font-bold opacity-70 uppercase tracking-widest mb-4">{t.labels.pieces}</p>
           <h4 className="text-7xl font-black">{res}</h4>
        </div>
      )}
    </div>
  );
};

const MeterToPieceCalculator = ({ t, onSave }: any) => {
  const [inputs, setInputs] = useState({ l: '0.60', m: '25' });
  const [res, setRes] = useState<number | null>(null);
  const calculate = () => {
    const p = Math.ceil(parseFloat(inputs.m) / parseFloat(inputs.l));
    setRes(p);
    onSave(t.sections.metToPcs, { pieces: p, meter: inputs.m });
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
       <div className="web-card p-8 space-y-6">
          <h3 className="text-xl font-bold border-l-4 border-indigo-600 pl-4">{t.sections.metToPcs}</h3>
          <InputGroup label={t.labels.length} value={inputs.l} onChange={v => setInputs({...inputs, l: v})} />
          <InputGroup label={t.labels.meter} value={inputs.m} onChange={v => setInputs({...inputs, m: v})} />
          <button onClick={calculate} className="btn-primary w-full bg-indigo-600">{t.labels.calcBtn}</button>
       </div>
       {res && (
         <div className="bg-indigo-600 text-white p-12 rounded-[40px] flex flex-col items-center justify-center shadow-2xl animate-fade">
            <p className="text-sm font-bold opacity-70 uppercase tracking-widest mb-4">{t.labels.pieces}</p>
            <h4 className="text-7xl font-black">{res}</h4>
         </div>
       )}
    </div>
  );
};

const PieceToAllCalculator = ({ t, onSave }: any) => {
  const [inputs, setInputs] = useState({ l: '0.60', w: '0.30', p: '100' });
  const [res, setRes] = useState<any>(null);
  const calculate = () => {
    const m = parseFloat(inputs.p) * parseFloat(inputs.l) * parseFloat(inputs.w);
    const met = parseFloat(inputs.p) * parseFloat(inputs.l);
    setRes({ murubba: m, meter: met });
    onSave(t.sections.pcsToAll, { pieces: inputs.p, murubba: m, meter: met });
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
       <div className="web-card p-8 space-y-6">
          <h3 className="text-xl font-bold border-l-4 border-red-600 pl-4">{t.sections.pcsToAll}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <InputGroup label={t.labels.length} value={inputs.l} onChange={v => setInputs({...inputs, l: v})} />
             <InputGroup label={t.labels.width} value={inputs.w} onChange={v => setInputs({...inputs, w: v})} />
             <div className="sm:col-span-2">
                <InputGroup label={t.labels.pieces} value={inputs.p} onChange={v => setInputs({...inputs, p: v})} />
             </div>
          </div>
          <button onClick={calculate} className="btn-primary w-full bg-red-600">{t.labels.calcBtn}</button>
       </div>
       {res && (
         <div className="grid grid-cols-2 gap-4 animate-fade">
            <ResultCard label={t.labels.murubba} value={res.murubba.toFixed(2)} color="bg-green-600" />
            <ResultCard label={t.labels.meter} value={res.meter.toFixed(2)} color="bg-slate-800" />
         </div>
       )}
    </div>
  );
};

// --- Portal Modules ---

const AIPortal = ({ t, lang }: any) => {
  const [prompt, setPrompt] = useState('');
  const [res, setRes] = useState('');
  const [loading, setLoading] = useState(false);

  const ask = async () => {
    if(!prompt.trim()) return;
    setLoading(true); setRes('');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are a professional construction and stone measurement expert for Carina Group. 
        Current language: ${lang}. 
        User asks: ${prompt}. 
        Focus on stone dimensions, Murubba (sqm), pieces calculation, and construction advice. Be professional and concise.`,
      });
      setRes(response.text || 'No answer.');
    } catch (e) { setRes('Error connecting to AI.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="web-card p-8 space-y-6">
        <h3 className="text-2xl font-black flex items-center gap-3">🤖 {lang === 'bn' ? 'এআই বিশেষজ্ঞ' : 'AI Construction Expert'}</h3>
        <p className="text-slate-500 text-sm">পাথর বা কনস্ট্রাকশন নিয়ে আপনার যেকোনো প্রশ্ন করুন। আমাদের এআই আপনাকে সঠিক তথ্য দিয়ে সাহায্য করবে।</p>
        <textarea 
          value={prompt} onChange={e => setPrompt(e.target.value)}
          className="input-field min-h-[150px] resize-none"
          placeholder={lang === 'bn' ? 'এখানে লিখুন...' : 'Type your question here...'}
        />
        <button onClick={ask} disabled={loading} className="btn-primary bg-blue-600 w-full text-lg">
          {loading ? 'প্রক্রিয়াধীন...' : (lang === 'bn' ? 'জিজ্ঞাসা করুন' : 'Ask Question')}
        </button>
      </div>
      {res && (
        <div className="bg-white p-8 rounded-3xl border-l-8 border-blue-600 shadow-xl text-slate-700 leading-relaxed text-lg animate-fade">
          {res}
        </div>
      )}
    </div>
  );
};

const HistoryPortal = ({ t, history, setHistory }: any) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black">{t.nav.history}</h3>
        {history.length > 0 && (
          <button onClick={() => { if(confirm('Are you sure?')) setHistory([]); }} className="text-xs font-bold text-red-500 hover:underline uppercase tracking-widest">Clear All History</button>
        )}
      </div>
      {history.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 text-slate-300 font-bold">📜 কোনো হিস্টোরি পাওয়া যায়নি।</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {history.map((h: any) => (
            <div key={h.id} className="web-card p-6 flex flex-col justify-between">
               <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-black uppercase text-slate-400">{h.type}</span>
                  <span className="text-[10px] text-slate-300">{h.timestamp}</span>
               </div>
               <div className="flex flex-wrap gap-2">
                  {Object.entries(h.data).map(([k, v]: any) => (
                    <div key={k} className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 flex items-center gap-2">
                       <span className="text-[10px] text-slate-400 font-bold uppercase">{k}:</span>
                       <span className="text-sm font-bold text-slate-700">{typeof v === 'number' ? v.toFixed(2) : v}</span>
                    </div>
                  ))}
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// -- UI Helpers --

const InputGroup = ({ label, value, onChange, placeholder = "" }: any) => (
  <div className="space-y-2">
    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</label>
    <input 
      type="number" 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      className="input-field" 
      placeholder={placeholder}
    />
  </div>
);

const ResultCard = ({ label, value, color }: any) => (
  <div className={`${color} p-6 rounded-3xl text-white shadow-lg text-center`}>
    <p className="text-[10px] font-bold uppercase opacity-80 mb-1 tracking-widest">{label}</p>
    <h4 className="text-3xl font-black">{value}</h4>
  </div>
);

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
