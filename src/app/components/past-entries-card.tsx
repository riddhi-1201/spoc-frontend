import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, ChevronDown, ChevronUp, Calendar, Clock, TrendingUp, Award } from 'lucide-react';

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

interface PastEntriesCardProps {
  isDark: boolean;
  submittedEntries?: SubmittedEntry[];
}

export function PastEntriesCard({ isDark, submittedEntries = [] }: PastEntriesCardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRow, setExpandedRow] = useState<string | number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const mockPastEntries = [
    {
      id: 1,
      date: '2026-02-12',
      workMode: 'Office',
      project: 'Dashboard Redesign',
      task: 'Development',
      element: 'Frontend',
      subElement: 'UI Components',
      units: 45,
      hours: 6.5,
      status: 'Completed',
      notes: 'Implemented new card components with glassmorphic design. Added animations and hover effects.',
      productivity: 92,
    },
    {
      id: 2,
      date: '2026-02-11',
      workMode: 'Remote',
      project: 'API Integration',
      task: 'Development',
      element: 'Backend',
      subElement: 'API Integration',
      units: 38,
      hours: 7.0,
      status: 'Completed',
      notes: 'Connected third-party payment gateway. Implemented error handling and retry logic.',
      productivity: 88,
    },
    {
      id: 3,
      date: '2026-02-10',
      workMode: 'Hybrid',
      project: 'Mobile App',
      task: 'Testing',
      element: 'Frontend',
      subElement: 'Optimization',
      units: 52,
      hours: 8.0,
      status: 'Completed',
      notes: 'Performed comprehensive testing on iOS and Android. Fixed 12 critical bugs.',
      productivity: 95,
    },
    {
      id: 4,
      date: '2026-02-09',
      workMode: 'Office',
      project: 'Dashboard Redesign',
      task: 'Design',
      element: 'Frontend',
      subElement: 'UI Components',
      units: 40,
      hours: 7.5,
      status: 'Completed',
      notes: 'Created high-fidelity mockups for new dashboard. Received stakeholder approval.',
      productivity: 85,
    },
    {
      id: 5,
      date: '2026-02-08',
      workMode: 'Remote',
      project: 'API Integration',
      task: 'Development',
      element: 'Backend',
      subElement: 'Database',
      units: 35,
      hours: 6.0,
      status: 'In Progress',
      notes: 'Optimizing database queries for better performance. Migration in progress.',
      productivity: 78,
    },
    {
      id: 6,
      date: '2026-02-07',
      workMode: 'Office',
      project: 'Documentation',
      task: 'Meeting',
      element: 'Backend',
      subElement: 'API Integration',
      units: 20,
      hours: 4.5,
      status: 'Completed',
      notes: 'Team sync meeting. Discussed Q1 roadmap and resource allocation.',
      productivity: 70,
    },
    {
      id: 7,
      date: '2026-02-06',
      workMode: 'Remote',
      project: 'Mobile App',
      task: 'Development',
      element: 'Frontend',
      subElement: 'UI Components',
      units: 48,
      hours: 8.0,
      status: 'Completed',
      notes: 'Built new onboarding flow with interactive animations. User testing scheduled.',
      productivity: 90,
    },
  ];

  // Merge submitted entries with mock data
  const convertedSubmitted = submittedEntries.map(entry => ({
    ...entry,
    productivity: entry.score,
  }));

  const pastEntries = [...convertedSubmitted, ...mockPastEntries];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Completed':
        return { 
          bg: 'from-green-500/20 to-emerald-500/20', 
          border: 'border-green-500/30',
          text: 'text-green-400' 
        };
      case 'In Progress':
        return { 
          bg: 'from-blue-500/20 to-cyan-500/20', 
          border: 'border-blue-500/30',
          text: 'text-blue-400' 
        };
      case 'Pending':
        return { 
          bg: 'from-yellow-500/20 to-orange-500/20', 
          border: 'border-yellow-500/30',
          text: 'text-yellow-400' 
        };
      case 'Blocked':
        return { 
          bg: 'from-red-500/20 to-pink-500/20', 
          border: 'border-red-500/30',
          text: 'text-red-400' 
        };
      default:
        return { 
          bg: 'from-slate-500/20 to-gray-500/20', 
          border: 'border-slate-500/30',
          text: 'text-slate-400' 
        };
    }
  };

  const getWorkModeConfig = (mode: string) => {
    switch (mode) {
      case 'Office':
        return { gradient: 'from-blue-400 to-cyan-400', icon: '🏢' };
      case 'Remote':
        return { gradient: 'from-purple-400 to-pink-400', icon: '🏠' };
      case 'Hybrid':
        return { gradient: 'from-teal-400 to-emerald-400', icon: '🔄' };
      default:
        return { gradient: 'from-slate-400 to-gray-400', icon: '📍' };
    }
  };

  const filteredEntries = pastEntries.filter(entry =>
    entry.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.workMode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEntries = filteredEntries.slice(startIndex, startIndex + itemsPerPage);

  const totalHours = pastEntries.reduce((sum, entry) => sum + entry.hours, 0);
  const totalUnits = pastEntries.reduce((sum, entry) => sum + entry.units, 0);
  const avgProductivity = Math.round(pastEntries.reduce((sum, entry) => sum + entry.productivity, 0) / pastEntries.length);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={`backdrop-blur-xl rounded-2xl border shadow-2xl overflow-hidden transition-colors duration-500 ${
        isDark
          ? 'bg-slate-800/90 border-slate-700'
          : 'bg-white/90 border-gray-200'
      }`}
    >
      {/* Header */}
      <div className={`bg-gradient-to-r border-b px-8 py-6 transition-colors duration-500 ${
        isDark
          ? 'from-indigo-900/30 to-purple-900/30 border-slate-700'
          : 'from-indigo-50 to-purple-50 border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`text-2xl mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Past 7 Days Entries</h3>
            <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Your recent work history and analytics</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg ${
              isDark ? 'shadow-indigo-500/30' : ''
            }`}>
              <Calendar size={24} className="text-white" />
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className={`backdrop-blur-xl border rounded-xl p-4 transition-colors duration-500 ${
            isDark
              ? 'bg-slate-900/50 border-slate-600'
              : 'bg-white/50 border-gray-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Clock size={18} className={isDark ? 'text-teal-400' : 'text-teal-600'} />
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Total Hours</span>
            </div>
            <p className={`text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`}>{totalHours.toFixed(1)}h</p>
          </div>

          <div className={`backdrop-blur-xl border rounded-xl p-4 transition-colors duration-500 ${
            isDark
              ? 'bg-slate-900/50 border-slate-600'
              : 'bg-white/50 border-gray-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Award size={18} className={isDark ? 'text-purple-400' : 'text-purple-600'} />
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Total Units</span>
            </div>
            <p className={`text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`}>{totalUnits}</p>
          </div>

          <div className={`backdrop-blur-xl border rounded-xl p-4 transition-colors duration-500 ${
            isDark
              ? 'bg-slate-900/50 border-slate-600'
              : 'bg-white/50 border-gray-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={18} className={isDark ? 'text-emerald-400' : 'text-emerald-600'} />
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Avg Score</span>
            </div>
            <p className={`text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`}>{avgProductivity}%</p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className={`px-8 py-4 border-b transition-colors duration-500 ${
        isDark
          ? 'border-slate-700 bg-slate-900/30'
          : 'border-gray-200 bg-gray-50/30'
      }`}>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-gray-400'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by project, task, or work mode..."
              className={`w-full pl-10 pr-4 py-2.5 border rounded-xl transition-all duration-300 ${
                isDark
                  ? 'bg-slate-900/50 border-slate-600 text-white placeholder-slate-500 focus:ring-teal-500/50 focus:border-transparent'
                  : 'bg-white/50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-teal-500 focus:border-transparent'
              } focus:outline-none focus:ring-2`}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2.5 border rounded-xl transition-all duration-300 flex items-center gap-2 ${
              isDark
                ? 'bg-slate-900/50 border-slate-600 text-slate-300 hover:bg-slate-900/80 hover:border-slate-500'
                : 'bg-white/50 border-gray-200 text-gray-700 hover:bg-white/80 hover:border-gray-300'
            }`}
          >
            <Filter size={18} />
            <span className="hidden sm:inline">Filter</span>
          </motion.button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
        <table className="w-full">
          <thead className="sticky top-0">
            <tr className={`border-b transition-colors duration-500 ${
              isDark
                ? 'bg-slate-900/50 border-slate-700'
                : 'bg-gray-50 border-gray-200'
            }`}>
              <th className={`px-6 py-4 text-left text-xs uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Date</th>
              <th className={`px-6 py-4 text-left text-xs uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Work Mode</th>
              <th className={`px-6 py-4 text-left text-xs uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Project</th>
              <th className={`px-6 py-4 text-left text-xs uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Task</th>
              <th className={`px-6 py-4 text-left text-xs uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Units</th>
              <th className={`px-6 py-4 text-left text-xs uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Hours</th>
              <th className={`px-6 py-4 text-left text-xs uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Score</th>
              <th className={`px-6 py-4 text-left text-xs uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Status</th>
              <th className={`px-6 py-4 text-left text-xs uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-600'}`}></th>
            </tr>
          </thead>
          <tbody>
            {paginatedEntries.map((entry, index) => {
              const isExpanded = expandedRow === entry.id;
              const statusConfig = getStatusConfig(entry.status);
              const modeConfig = getWorkModeConfig(entry.workMode);
              const isEven = index % 2 === 0;
              const isNew = (entry as any).isNew === true;

              return (
                <React.Fragment key={entry.id}>
                  <motion.tr
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)' }}
                    className={`border-b transition-all duration-300 ${
                      isNew 
                        ? isDark 
                          ? 'border-emerald-500/50 bg-emerald-500/10 shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-500/30'
                          : 'border-emerald-400/50 bg-emerald-100/30 shadow-lg shadow-emerald-400/20 ring-1 ring-emerald-400/30'
                        : isDark
                          ? `border-slate-800 ${isEven ? 'bg-slate-900/20' : 'bg-transparent'}`
                          : `border-gray-100 ${isEven ? 'bg-gray-50/20' : 'bg-transparent'}`
                    }`}
                  >
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {isNew && <span className={`inline-block mr-2 px-2 py-0.5 text-xs font-semibold rounded ${isDark ? 'bg-emerald-500/30 text-emerald-300' : 'bg-emerald-400/30 text-emerald-700'}`}>NEW</span>}
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r ${modeConfig.gradient} bg-opacity-20 text-xs text-white`}>
                        <span>{modeConfig.icon}</span>
                        {entry.workMode}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{entry.project}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>{entry.task}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{entry.units}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{entry.hours}h</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className={`w-16 h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-900/50' : 'bg-gray-200'}`}>
                          <motion.div
                            className={`h-full bg-gradient-to-r ${
                              entry.productivity >= 90
                                ? 'from-green-400 to-emerald-400'
                                : entry.productivity >= 75
                                ? 'from-teal-400 to-cyan-400'
                                : 'from-yellow-400 to-orange-400'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${entry.productivity}%` }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                          />
                        </div>
                        <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{entry.productivity}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs rounded-lg bg-gradient-to-r ${statusConfig.bg} border ${statusConfig.border} ${statusConfig.text}`}>
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <motion.button
                        onClick={() => setExpandedRow(isExpanded ? null : entry.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-2 rounded-lg transition-colors ${
                          isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                        }`}
                      >
                        {isExpanded ? (
                          <ChevronUp size={18} className={isDark ? 'text-slate-400' : 'text-gray-600'} />
                        ) : (
                          <ChevronDown size={18} className={isDark ? 'text-slate-400' : 'text-gray-600'} />
                        )}
                      </motion.button>
                    </td>
                  </motion.tr>

                  {/* Expanded Row Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <td colSpan={9} className={isDark ? 'px-6 py-4 bg-slate-900/40' : 'px-6 py-4 bg-gray-50'}>
                          <div className={`grid grid-cols-2 gap-4 p-4 rounded-xl border ${
                            isDark
                              ? 'bg-slate-800/50 border-slate-600'
                              : 'bg-white border-gray-200'
                          }`}>
                            <div>
                              <p className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Element</p>
                              <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{entry.element}</p>
                            </div>
                            <div>
                              <p className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Sub-Element</p>
                              <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{entry.subElement}</p>
                            </div>
                            <div className="col-span-2">
                              <p className={`text-xs mb-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Notes</p>
                              <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{entry.notes}</p>
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={`px-8 py-4 border-t transition-colors duration-500 ${
          isDark
            ? 'border-slate-700 bg-slate-900/30'
            : 'border-gray-200 bg-gray-50/30'
        }`}>
          <div className="flex items-center justify-between">
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredEntries.length)} of{' '}
              {filteredEntries.length} entries
            </p>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <motion.button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-10 h-10 rounded-lg transition-all duration-300 ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/30'
                      : isDark
                        ? 'bg-slate-900/50 text-slate-400 hover:bg-slate-900/80 border border-slate-600'
                        : 'bg-white/50 text-gray-600 hover:bg-white/80 border border-gray-200'
                  }`}
                >
                  {page}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
