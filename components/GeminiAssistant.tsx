
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Language } from '../types';

interface Props {
  t: any;
  lang: Language;
}

const GeminiAssistant: React.FC<Props> = ({ t, lang }) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const responseEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    responseEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [response]);

  const askGemini = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse('');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const languageMap = {
        [Language.BN]: 'Bengali',
        [Language.HI]: 'Hindi',
        [Language.AR]: 'Arabic',
        [Language.EN]: 'English'
      };

      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `
        You are a helpful construction expert assistant focused on stone measurements.
        Current UI Language: ${languageMap[lang]}.
        Terminology: Use specific terms like 'Murubba' (1m x 1m), 'Meter' (Length), 'Pieces', and 'Volume'.
        Note: The calculator app uses Thickness in Centimeters (CM) for volume calculation (L * W * (T_cm / 100)).
        User prompt: ${prompt}
        Answer in ${languageMap[lang]} clearly and concisely for a mobile screen.
        `,
      });
      setResponse(result.text || 'No response found.');
    } catch (error) {
      setResponse(lang === Language.BN ? 'দুঃখিত, আবার চেষ্টা করুন।' : 'Sorry, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4 pb-4">
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">🤖</div>
          <div>
            <h2 className="font-bold text-slate-800">{t.tabs.ai} {lang === Language.BN ? 'সহকারী' : 'Assistant'}</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Construction Expert</p>
          </div>
        </div>
        
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={lang === Language.BN ? 'আপনার প্রশ্নটি এখানে লিখুন...' : 'Write your question here...'}
          className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 min-h-[100px] text-sm focus:border-blue-500 outline-none transition-all"
        />
        
        <button
          onClick={askGemini}
          disabled={loading}
          className={`w-full mt-3 bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-md active:scale-95 transition-all ${loading ? 'opacity-50' : ''}`}
        >
          {loading ? '...' : (lang === Language.BN ? 'উত্তর জানুন' : 'Get Answer')}
        </button>
      </div>

      {response && (
        <div className="bg-blue-600 text-white p-5 rounded-3xl shadow-lg relative animate-fadeIn">
            <div className="absolute -top-2 left-6 w-4 h-4 bg-blue-600 rotate-45"></div>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{response}</p>
            <div ref={responseEndRef} />
        </div>
      )}
    </div>
  );
};

export default GeminiAssistant;
