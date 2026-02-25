import { motion } from 'motion/react';
import { Clock, CheckCircle2, TrendingUp, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

interface PerformanceCardProps {
  isDark: boolean;
}

export function PerformanceCard({ isDark }: PerformanceCardProps) {
  const [hasEntries] = useState(true);

  // Mock data for the productivity chart
  const productivityData = [
    { hour: '9AM', value: 65 },
    { hour: '10AM', value: 78 },
    { hour: '11AM', value: 85 },
    { hour: '12PM', value: 70 },
    { hour: '1PM', value: 60 },
    { hour: '2PM', value: 82 },
    { hour: '3PM', value: 90 },
    { hour: '4PM', value: 88 },
    { hour: '5PM', value: 75 },
  ];

  // Progress bar data
  const progressMetrics = [
    { label: 'Efficiency', value: 87, color: 'from-green-500 to-emerald-600' },
    { label: 'Deadline Compliance', value: 92, color: 'from-indigo-500 to-purple-600' },
    { label: 'Focus Score', value: 78, color: 'from-amber-500 to-orange-600' },
  ];

  if (!hasEntries) {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className={`backdrop-blur-xl rounded-2xl border shadow-xl overflow-hidden min-h-96 flex items-center justify-center transition-colors duration-500 ${
          isDark
            ? 'bg-slate-800/90 border-slate-700'
            : 'bg-white/90 border-gray-200'
        }`}
      >
        <div className="text-center">
          <div className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-br rounded-full flex items-center justify-center ${
            isDark ? 'from-slate-700 to-slate-600' : 'from-gray-100 to-gray-200'
          }`}>
            <BarChart3 size={40} className={isDark ? 'text-slate-400' : 'text-gray-400'} />
          </div>
          <h3 className={`text-xl mb-2 ${isDark ? 'text-slate-200' : 'text-gray-600'}`}>No entries yet</h3>
          <p className={isDark ? 'text-slate-400' : 'text-gray-400'}>Log your work to see insights</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`backdrop-blur-xl rounded-2xl border shadow-xl overflow-hidden transition-colors duration-500 ${
        isDark
          ? 'bg-slate-800/90 border-slate-700'
          : 'bg-white/90 border-gray-200'
      }`}
    >
      {/* Header */}
      <div className={`border-b px-8 py-6 transition-colors duration-500 ${
        isDark
          ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border-slate-700'
          : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-gray-200'
      }`}>
        <h3 className={`text-2xl mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Today's Performance</h3>
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Your productivity metrics for today</p>
      </div>

      <div className="p-8 space-y-8">
        {/* KPI Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`rounded-xl p-6 border backdrop-blur transition-colors duration-500 ${
              isDark
                ? 'bg-slate-900/50 border-blue-500/30 from-blue-900/20 to-indigo-900/20'
                : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <Clock size={24} className="text-white" />
              </div>
            </div>
            <div className={`text-3xl mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>7.5h</div>
            <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Total Hours</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`rounded-xl p-6 border backdrop-blur transition-colors duration-500 ${
              isDark
                ? 'bg-slate-900/50 border-green-500/30'
                : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-100'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
                <CheckCircle2 size={24} className="text-white" />
              </div>
            </div>
            <div className={`text-3xl mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>12</div>
            <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Tasks Completed</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`rounded-xl p-6 border backdrop-blur transition-colors duration-500 ${
              isDark
                ? 'bg-slate-900/50 border-purple-500/30'
                : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
                <TrendingUp size={24} className="text-white" />
              </div>
            </div>
            <div className={`text-3xl mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>87%</div>
            <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Productivity Score</div>
          </motion.div>
        </div>

        {/* Progress Bars Section */}
        <div className="space-y-6">
          <h4 className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>Performance Metrics</h4>
          {progressMetrics.map((metric, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{metric.label}</span>
                <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-900'}`}>{metric.value}%</span>
              </div>
              <div className={`h-3 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.value}%` }}
                  transition={{ duration: 1, delay: index * 0.1, ease: 'easeOut' }}
                  className={`h-full bg-gradient-to-r ${metric.color} rounded-full`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Mini Analytics Chart */}
        <div>
          <h4 className={`text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Hourly Productivity Trend</h4>
          <div className={`h-64 rounded-xl p-4 border ${
            isDark
              ? 'bg-slate-900/50 border-slate-700'
              : 'bg-gradient-to-br from-gray-50 to-blue-50 border-gray-100'
          }`}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={productivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#475569' : '#E5E7EB'} />
                <XAxis
                  dataKey="hour"
                  stroke={isDark ? '#94A3B8' : '#9CA3AF'}
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke={isDark ? '#94A3B8' : '#9CA3AF'}
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                    border: isDark ? '1px solid #475569' : '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: isDark ? '#E2E8F0' : '#000000'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="url(#colorGradient)"
                  strokeWidth={3}
                  dot={{ fill: '#6366F1', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
