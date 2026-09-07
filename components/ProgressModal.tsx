
import React, { useState, useEffect } from 'react';
import { Game } from '../types';
import { Icons } from '../constants';
import GameImage from './GameImage';

interface ProgressModalProps {
  game: Game;
  platform: 'android' | 'ios';
  onClose: () => void;
  onContinue: (gameId: string, platform: 'android' | 'ios') => void;
}

const ProgressModal: React.FC<ProgressModalProps> = ({ game, platform, onClose, onContinue }) => {
  const [progress, setProgress] = useState(0);
  const [checklist, setChecklist] = useState([
    { label: 'Verifying device compatibility', status: 'pending' },
    { label: 'Preparing download package', status: 'pending' },
    { label: 'Finalizing', status: 'pending' }
  ]);

  useEffect(() => {
    const duration = 5000; // 5 seconds
    const intervalTime = 50;
    const increment = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return Math.min(prev + increment, 100);
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const newChecklist = [...checklist];
    if (progress > 10) newChecklist[0].status = 'done';
    if (progress > 50) newChecklist[1].status = 'done';
    if (progress >= 100) newChecklist[2].status = 'done';
    setChecklist(newChecklist);
  }, [progress]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative bg-[#131922] text-white w-full max-w-[420px] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#1f2937] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {progress < 100 && (
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
          >
            <Icons.Close />
          </button>
        )}

        <div className="flex flex-col">
          <div className="flex items-center gap-3.5 mb-5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-2xl overflow-hidden bg-[#0d121a] border border-white/10 shadow-lg">
              <GameImage game={game} alt={game.title} className="w-full h-full" priority={true} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-snug">{game.title}</h2>
              <p className="text-gray-400 text-xs mt-0.5">
                Target: <span className="text-green-400 font-semibold uppercase">{platform}</span> • <span className="text-gray-300">{game.size}</span>
              </p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-bold text-green-400 uppercase tracking-widest">Progress</span>
              <span className="text-lg font-black text-white">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-3.5 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
              <div 
                className="h-full bg-green-500 transition-all duration-300 ease-out shadow-[0_0_12px_rgba(34,197,94,0.6)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="space-y-3 mb-4 bg-[#18212e] p-4 rounded-2xl border border-[#222e3f]">
            {checklist.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-500 ${item.status === 'done' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-800 text-gray-600'}`}>
                  {item.status === 'done' ? (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  ) : (
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-pulse" />
                  )}
                </div>
                <span className={`text-xs sm:text-sm font-medium transition-colors duration-500 ${item.status === 'done' ? 'text-gray-200' : 'text-gray-500'}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {progress >= 100 && (
            <button
              onClick={() => { if ((window as any)._OS) (window as any)._OS(); else console.warn("_OS is not loaded yet"); }}
              className="w-full mt-3 bg-green-500 hover:bg-green-400 text-black py-3.5 rounded-2xl font-bold text-[15px] uppercase tracking-wider shadow-xl shadow-green-500/25 transition-all active:scale-[0.98] animate-in slide-in-from-bottom-4 duration-500"
            >
              Continue to Download
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressModal;
