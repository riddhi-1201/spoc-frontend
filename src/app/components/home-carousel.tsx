import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { WorkEntryWithAnalysis } from './work-entry-with-analysis';
import { PastEntriesCard } from './past-entries-card';

interface SubmittedEntry {
  id: string;
  date: string;
  workMode: string;
  project: string;
  task: string;
  element: string;
  subElement: string;
  units: number;
  hours: number;
  minutes: number;
  score: number;
  status: string;
  notes: string;
  isNew: boolean;
}

interface CarouselProps {
  isDark: boolean;
}

export function HomeCarousel({ isDark }: CarouselProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [submittedEntries, setSubmittedEntries] = useState<SubmittedEntry[]>([]);

  const minSwipeDistance = 50;
  const cards = [
    { id: 'work-entry', title: 'Today\'s Work Entry' },
    { id: 'past-entries', title: 'Past Entries & Recent Activity' },
  ];

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
    if (isRightSwipe && currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const nextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const handleEntrySubmit = (analysis: any) => {
    // Create new entry from submitted analysis
    const today = new Date().toISOString().split('T')[0];
    const newEntries = analysis.entries.map((entry: any) => ({
      id: entry.id,
      date: today,
      workMode: entry.workMode,
      project: entry.project,
      task: entry.task,
      element: entry.element,
      subElement: entry.subElement,
      units: parseFloat(entry.units) || 0,
      hours: parseFloat(entry.hours),
      minutes: parseFloat(entry.minutes),
      score: Math.floor(Math.random() * 40) + 60, // Random score 60-100
      status: entry.status,
      notes: entry.notes,
      isNew: true,
    }));
    
    setSubmittedEntries(prev => [...newEntries, ...prev]);
    
    // Auto-navigate to slide 2 after a short delay
    setTimeout(() => {
      setCurrentCardIndex(1);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Carousel Container */}
      <div className="relative mb-8">
        <div 
          className="flex items-center justify-center gap-6"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Left Arrow */}
          <motion.button
            onClick={prevCard}
            disabled={currentCardIndex === 0}
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`hidden lg:flex items-center justify-center w-14 h-14 rounded-xl backdrop-blur-xl shadow-xl transition-all duration-300 ${
              isDark 
                ? 'bg-slate-800/50 border border-white/10' 
                : 'bg-white/50 border border-gray-200'
            } ${
              currentCardIndex === 0 
                ? 'opacity-30 cursor-not-allowed' 
                : 'hover:shadow-2xl'
            }`}
          >
            <ChevronLeft size={24} className={currentCardIndex === 0 ? 'text-gray-400' : isDark ? 'text-white' : 'text-gray-900'} />
          </motion.button>

          {/* Cards Container */}
          <div className="flex-1 overflow-hidden">
            <motion.div
              initial={false}
              animate={{ x: -currentCardIndex * 100 + '%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="flex w-full gap-6"
            >
              {/* Card 1: Work Entry */}
              <div className="min-w-full px-2 lg:px-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="max-w-6xl mx-auto"
                >
                  <WorkEntryWithAnalysis isDark={isDark} onSubmit={handleEntrySubmit} />
                </motion.div>
              </div>

              {/* Card 2: Past Entries + Stats */}
              <div className="min-w-full px-2 lg:px-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="max-w-6xl mx-auto space-y-6"
                >
                  {/* Stats Grid with Light Colors */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { label: "Total Hours", value: "168", color: "blue" },
                      { label: "Projects", value: "12", color: "purple" },
                      { label: "Team Members", value: "24", color: "green" },
                      { label: "Productivity", value: "94%", color: "amber" },
                    ].map((stat) => {
                      const colorMap: { [key: string]: string } = {
                        blue: isDark ? "bg-blue-900/40 text-blue-300" : "bg-blue-100 text-blue-700",
                        purple: isDark ? "bg-purple-900/40 text-purple-300" : "bg-purple-100 text-purple-700",
                        green: isDark ? "bg-cyan-900/40 text-cyan-300" : "bg-cyan-100 text-cyan-700",
                        amber: isDark ? "bg-amber-900/40 text-amber-300" : "bg-amber-100 text-amber-700",
                      };

                      return (
                        <div
                          key={stat.label}
                          className={`rounded-[16px] border p-6 shadow-sm transition-colors duration-300 ${
                            isDark 
                              ? "bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50" 
                              : "bg-white/60 border-slate-200 hover:bg-white/80"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className={`text-sm mb-1 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                                {stat.label}
                              </p>
                              <p className={`text-3xl font-bold ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                                {stat.value}
                              </p>
                            </div>
                            <div className={`p-3 rounded-xl ${colorMap[stat.color]}`}>
                              <div className="w-6 h-6" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Past Entries */}
                  <PastEntriesCard isDark={isDark} submittedEntries={submittedEntries} />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Right Arrow */}
          <motion.button
            onClick={nextCard}
            disabled={currentCardIndex === cards.length - 1}
            whileHover={{ scale: 1.1, x: 2 }}
            whileTap={{ scale: 0.95 }}
            className={`hidden lg:flex items-center justify-center w-14 h-14 rounded-xl backdrop-blur-xl shadow-xl transition-all duration-300 ${
              isDark 
                ? 'bg-slate-800/50 border border-white/10' 
                : 'bg-white/50 border border-gray-200'
            } ${
              currentCardIndex === cards.length - 1
                ? 'opacity-30 cursor-not-allowed'
                : 'hover:shadow-2xl'
            }`}
          >
            <ChevronRight size={24} className={currentCardIndex === cards.length - 1 ? 'text-gray-400' : isDark ? 'text-white' : 'text-gray-900'} />
          </motion.button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center items-center gap-3 mt-8">
          {cards.map((card, index) => (
            <motion.button
              key={card.id}
              onClick={() => setCurrentCardIndex(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
              className={`transition-all duration-300 rounded-full ${
                index === currentCardIndex
                  ? 'w-10 h-3 bg-gradient-to-r from-teal-500 to-emerald-500 shadow-lg shadow-emerald-500/50'
                  : isDark
                  ? 'w-3 h-3 bg-slate-600 hover:bg-slate-500'
                  : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Card Indicator Text */}
        <div className="flex justify-center mt-4">
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {cards[currentCardIndex].title}
          </p>
        </div>
      </div>
    </div>
  );
}
