import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Calendar } from 'lucide-react';
import { useState } from 'react';

interface PastEntriesPanelProps {
  isDark: boolean;
}

export function PastEntriesPanel({ isDark }: PastEntriesPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Mock data for past entries
  const pastEntries = [
    {
      id: 1,
      date: '2026-02-12',
      workMode: 'Office',
      project: 'Dashboard Redesign',
      task: 'Development',
      units: 45,
      hours: 6.5,
      status: 'Completed',
    },
    {
      id: 2,
      date: '2026-02-11',
      workMode: 'Remote',
      project: 'API Integration',
      task: 'Development',
      units: 38,
      hours: 7.0,
      status: 'Completed',
    },
    {
      id: 3,
      date: '2026-02-10',
      workMode: 'Hybrid',
      project: 'Mobile App',
      task: 'Testing',
      units: 52,
      hours: 8.0,
      status: 'Completed',
    },
    {
      id: 4,
      date: '2026-02-09',
      workMode: 'Office',
      project: 'Dashboard Redesign',
      task: 'Design',
      units: 40,
      hours: 7.5,
      status: 'Completed',
    },
    {
      id: 5,
      date: '2026-02-08',
      workMode: 'Remote',
      project: 'API Integration',
      task: 'Development',
      units: 35,
      hours: 6.0,
      status: 'In Progress',
    },
    {
      id: 6,
      date: '2026-02-07',
      workMode: 'Office',
      project: 'Documentation',
      task: 'Meeting',
      units: 20,
      hours: 4.5,
      status: 'Completed',
    },
    {
      id: 7,
      date: '2026-02-06',
      workMode: 'Remote',
      project: 'Mobile App',
      task: 'Development',
      units: 48,
      hours: 8.0,
      status: 'Completed',
    },
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Completed':
        return isDark
          ? 'bg-green-500/20 text-green-400'
          : 'bg-green-100 text-green-700';
      case 'In Progress':
        return isDark
          ? 'bg-blue-500/20 text-blue-400'
          : 'bg-blue-100 text-blue-700';
      case 'Pending':
        return isDark
          ? 'bg-yellow-500/20 text-yellow-400'
          : 'bg-yellow-100 text-yellow-700';
      case 'Blocked':
        return isDark
          ? 'bg-red-500/20 text-red-400'
          : 'bg-red-100 text-red-700';
      default:
        return isDark
          ? 'bg-slate-500/20 text-slate-400'
          : 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className={`backdrop-blur-xl rounded-2xl border shadow-xl overflow-hidden transition-colors duration-500 ${
      isDark
        ? 'bg-slate-800/90 border-slate-700'
        : 'bg-white/90 border-gray-200'
    }`}>
      {/* Header Strip */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full px-8 py-5 flex items-center justify-between transition-all hover:bg-opacity-70 ${
          isDark
            ? 'bg-slate-800/50 hover:bg-slate-700/50'
            : 'bg-gray-50/50 hover:bg-gray-100/50'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
            <Calendar size={20} className="text-white" />
          </div>
          <div className="text-left">
            <h3 className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>Past 7 Days Entries</h3>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>View your recent work logs</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown size={24} className={isDark ? 'text-slate-400' : 'text-gray-600'} />
        </motion.div>
      </motion.button>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className={`border-t ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
              {/* Table Container */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`transition-colors duration-500 ${
                      isDark
                        ? 'bg-slate-900/50'
                        : 'bg-gradient-to-r from-gray-50 to-blue-50'
                    }`}>
                      <th className={`px-6 py-4 text-left text-xs uppercase tracking-wider ${
                        isDark
                          ? 'text-slate-400'
                          : 'text-gray-700'
                      }`}>Date</th>
                      <th className={`px-6 py-4 text-left text-xs uppercase tracking-wider ${
                        isDark
                          ? 'text-slate-400'
                          : 'text-gray-700'
                      }`}>Work Mode</th>
                      <th className={`px-6 py-4 text-left text-xs uppercase tracking-wider ${
                        isDark
                          ? 'text-slate-400'
                          : 'text-gray-700'
                      }`}>Project</th>
                      <th className={`px-6 py-4 text-left text-xs uppercase tracking-wider ${
                        isDark
                          ? 'text-slate-400'
                          : 'text-gray-700'
                      }`}>Task</th>
                      <th className={`px-6 py-4 text-left text-xs uppercase tracking-wider ${
                        isDark
                          ? 'text-slate-400'
                          : 'text-gray-700'
                      }`}>Units</th>
                      <th className={`px-6 py-4 text-left text-xs uppercase tracking-wider ${
                        isDark
                          ? 'text-slate-400'
                          : 'text-gray-700'
                      }`}>Hours</th>
                      <th className={`px-6 py-4 text-left text-xs uppercase tracking-wider ${
                        isDark
                          ? 'text-slate-400'
                          : 'text-gray-700'
                      }`}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pastEntries.map((entry, index) => (
                      <motion.tr
                        key={entry.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`border-b transition-colors ${
                          isDark
                            ? 'border-slate-700 hover:bg-slate-900/50'
                            : 'border-gray-100 hover:bg-gray-50'
                        }`}
                      >
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                          isDark
                            ? 'text-slate-300'
                            : 'text-gray-900'
                        }`}>
                          {new Date(entry.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                          isDark
                            ? 'text-slate-400'
                            : 'text-gray-600'
                        }`}>{entry.workMode}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                          isDark
                            ? 'text-slate-300'
                            : 'text-gray-900'
                        }`}>{entry.project}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                          isDark
                            ? 'text-slate-400'
                            : 'text-gray-600'
                        }`}>{entry.task}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                          isDark
                            ? 'text-slate-300'
                            : 'text-gray-900'
                        }`}>{entry.units}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                          isDark
                            ? 'text-slate-300'
                            : 'text-gray-900'
                        }`}>{entry.hours}h</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-xs rounded-full ${getStatusConfig(entry.status)}`}>
                            {entry.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Footer */}
              <div className={`px-8 py-5 border-t transition-colors duration-500 ${
                isDark
                  ? 'bg-slate-900/50 border-slate-700'
                  : 'bg-gradient-to-r from-gray-50 to-blue-50 border-gray-100'
              }`}>
                <div className="flex flex-wrap gap-8 text-sm">
                  <div>
                    <span className={isDark ? 'text-slate-400' : 'text-gray-600'}>Total Entries: </span>
                    <span className={isDark ? 'text-white' : 'text-gray-900'}>{pastEntries.length}</span>
                  </div>
                  <div>
                    <span className={isDark ? 'text-slate-400' : 'text-gray-600'}>Total Hours: </span>
                    <span className={isDark ? 'text-white' : 'text-gray-900'}>
                      {pastEntries.reduce((sum, entry) => sum + entry.hours, 0).toFixed(1)}h
                    </span>
                  </div>
                  <div>
                    <span className={isDark ? 'text-slate-400' : 'text-gray-600'}>Total Units: </span>
                    <span className={isDark ? 'text-white' : 'text-gray-900'}>
                      {pastEntries.reduce((sum, entry) => sum + entry.units, 0)}
                    </span>
                  </div>
                  <div>
                    <span className={isDark ? 'text-slate-400' : 'text-gray-600'}>Average Daily Hours: </span>
                    <span className={isDark ? 'text-white' : 'text-gray-900'}>
                      {(pastEntries.reduce((sum, entry) => sum + entry.hours, 0) / 7).toFixed(1)}h
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
