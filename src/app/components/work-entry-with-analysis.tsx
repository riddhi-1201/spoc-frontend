import { motion, AnimatePresence } from 'motion/react';
import { Clock, Calendar, Building2, Wifi, Home as HomeIcon, CheckCircle2, Target, Save, RotateCcw, Send, Trash2, Award, BarChart3, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface WorkLogEntry {
  id: string;
  workMode: string;
  project: string;
  task: string;
  element: string;
  subElement: string;
  hours: string;
  minutes: string;
  units: string;
  status: string;
  dueDate: string;
  notes: string;
  timestamp: string;
}

interface SubmittedAnalysis {
  totalHours: number;
  totalTasks: number;
  totalUnits: number;
  breakdown: {
    byWorkMode: { [key: string]: number };
    byStatus: { [key: string]: number };
    byTask: { [key: string]: number };
  };
  entries: WorkLogEntry[];
  submittedAt: string;
}

interface WorkEntryWithAnalysisProps {
  isDark: boolean;
  onSubmit?: (analysis: SubmittedAnalysis) => void;
}

export function WorkEntryWithAnalysis({ isDark, onSubmit }: WorkEntryWithAnalysisProps) {
  const [formData, setFormData] = useState({
    workMode: 'office',
    project: '',
    task: '',
    element: '',
    subElement: '',
    hours: '0',
    minutes: '0',
    units: '',
    status: '',
    dueDate: '',
    notes: '',
  });

  const [charCount, setCharCount] = useState(0);
  const [todayEntries, setTodayEntries] = useState<WorkLogEntry[]>([]);
  const [submittedAnalysis, setSubmittedAnalysis] = useState<SubmittedAnalysis | null>(null);
  const [showSubmitSuccess, setShowSubmitSuccess] = useState(false);
  const maxChars = 500;

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= maxChars) {
      setFormData({ ...formData, notes: text });
      setCharCount(text.length);
    }
  };

  const handleClear = () => {
    setFormData({
      workMode: 'office',
      project: '',
      task: '',
      element: '',
      subElement: '',
      hours: '0',
      minutes: '0',
      units: '',
      status: '',
      dueDate: '',
      notes: '',
    });
    setCharCount(0);
  };

  const handleAddEntry = () => {
    if (!formData.project || !formData.task || !formData.status) {
      alert('Please fill in Project, Task, and Status fields');
      return;
    }

    const newEntry: WorkLogEntry = {
      id: Date.now().toString(),
      ...formData,
      timestamp: new Date().toISOString(),
    };

    setTodayEntries([...todayEntries, newEntry]);
    handleClear();
  };

  const handleRemoveEntry = (id: string) => {
    setTodayEntries(todayEntries.filter(entry => entry.id !== id));
  };

  const handleSubmitWorklog = () => {
    if (todayEntries.length === 0) {
      alert('Please add at least one entry before submitting');
      return;
    }

    const totalHours = todayEntries.reduce((sum, entry) => {
      return sum + parseFloat(entry.hours) + parseFloat(entry.minutes) / 60;
    }, 0);

    const totalUnits = todayEntries.reduce((sum, entry) => {
      return sum + (parseFloat(entry.units) || 0);
    }, 0);

    const byWorkMode: { [key: string]: number } = {};
    const byStatus: { [key: string]: number } = {};
    const byTask: { [key: string]: number } = {};

    todayEntries.forEach(entry => {
      byWorkMode[entry.workMode] = (byWorkMode[entry.workMode] || 0) + 1;
      byStatus[entry.status] = (byStatus[entry.status] || 0) + 1;
      byTask[entry.task] = (byTask[entry.task] || 0) + 1;
    });

    const analysis: SubmittedAnalysis = {
      totalHours,
      totalTasks: todayEntries.length,
      totalUnits,
      breakdown: { byWorkMode, byStatus, byTask },
      entries: todayEntries,
      submittedAt: new Date().toISOString(),
    };

    setSubmittedAnalysis(analysis);
    setShowSubmitSuccess(true);
    onSubmit?.(analysis);
  };

  const workModes = [
    { id: 'office', label: 'Office', icon: Building2, gradient: 'from-blue-500 to-cyan-500' },
    { id: 'remote', label: 'Remote', icon: Wifi, gradient: 'from-purple-500 to-pink-500' },
    { id: 'hybrid', label: 'Hybrid', icon: HomeIcon, gradient: 'from-teal-500 to-emerald-500' },
  ];

  const statusOptions = [
    { value: 'in-progress', label: 'In Progress', color: 'from-blue-400 to-cyan-400' },
    { value: 'completed', label: 'Completed', color: 'from-green-400 to-emerald-400' },
    { value: 'pending', label: 'Pending', color: 'from-yellow-400 to-orange-400' },
    { value: 'blocked', label: 'Blocked', color: 'from-red-400 to-pink-400' },
  ];

  const todayStats = {
    hoursTracked: todayEntries.reduce((sum, entry) => {
      return sum + parseFloat(entry.hours) + parseFloat(entry.minutes) / 60;
    }, 0),
    tasksCompleted: todayEntries.filter(e => e.status === 'completed').length,
    totalTasks: todayEntries.length,
    totalUnits: todayEntries.reduce((sum, entry) => sum + (parseFloat(entry.units) || 0), 0),
  };

  const getStatusColor = (status: string) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option?.color || 'from-slate-400 to-gray-400';
  };

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Side - Work Entry Form */}
        <div className={`xl:col-span-2 backdrop-blur-xl rounded-2xl border shadow-xl overflow-hidden transition-colors duration-500 ${
          isDark 
            ? 'bg-slate-800/90 border-slate-700' 
            : 'bg-white/90 border-gray-200'
        }`}>
          <div className={`bg-gradient-to-r border-b px-8 py-6 transition-colors duration-500 ${
            isDark
              ? 'from-teal-900/30 to-emerald-900/30 border-slate-700'
              : 'from-teal-50 to-emerald-50 border-gray-200'
          }`}>
            <h3 className={`text-2xl mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Today's Work Entry</h3>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Fill in your work details for today</p>
          </div>

          <div className="p-8 space-y-6">
            {/* Work Mode */}
            <div>
              <label className={`text-sm mb-3 block ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Work Mode</label>
              <div className="grid grid-cols-3 gap-3">
                {workModes.map((mode) => {
                  const Icon = mode.icon;
                  const isSelected = formData.workMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, workMode: mode.id })}
                      className={`p-4 rounded-xl border transition-all ${
                        isSelected
                          ? `bg-gradient-to-r ${mode.gradient} border-transparent text-white shadow-lg`
                          : isDark
                          ? 'bg-slate-900/50 border-slate-700 text-slate-300 hover:bg-slate-900/70'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon size={24} className="mx-auto mb-2" />
                      <span className="text-xs block">{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Project *</label>
                <input
                  type="text"
                  value={formData.project}
                  onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                  placeholder="Search or enter project..."
                  className={`w-full px-4 py-3 rounded-xl border transition-all ${
                    isDark
                      ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:ring-teal-500/50'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-teal-500'
                  } focus:outline-none focus:ring-2 focus:border-transparent`}
                />
              </div>

              <div>
                <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Task *</label>
                <select
                  value={formData.task}
                  onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border transition-all ${
                    isDark
                      ? 'bg-slate-900/50 border-slate-700 text-white focus:ring-teal-500/50'
                      : 'bg-gray-50 border-gray-200 text-gray-900 focus:ring-teal-500'
                  } focus:outline-none focus:ring-2 focus:border-transparent`}
                >
                  <option value="">Select task</option>
                  <option value="development">Development</option>
                  <option value="design">Design</option>
                  <option value="testing">Testing</option>
                  <option value="meeting">Meeting</option>
                </select>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Element</label>
                <select
                  value={formData.element}
                  onChange={(e) => setFormData({ ...formData, element: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border transition-all ${
                    isDark
                      ? 'bg-slate-900/50 border-slate-700 text-white focus:ring-teal-500/50'
                      : 'bg-gray-50 border-gray-200 text-gray-900 focus:ring-teal-500'
                  } focus:outline-none focus:ring-2 focus:border-transparent`}
                >
                  <option value="">Select element</option>
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="database">Database</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Sub-Element</label>
                <select
                  value={formData.subElement}
                  onChange={(e) => setFormData({ ...formData, subElement: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border transition-all ${
                    isDark
                      ? 'bg-slate-900/50 border-slate-700 text-white focus:ring-teal-500/50'
                      : 'bg-gray-50 border-gray-200 text-gray-900 focus:ring-teal-500'
                  } focus:outline-none focus:ring-2 focus:border-transparent`}
                >
                  <option value="">Select sub-element</option>
                  <option value="ui">UI Components</option>
                  <option value="api">API Integration</option>
                  <option value="optimization">Optimization</option>
                </select>
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Hours</label>
                <div className="relative">
                  <Clock size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-gray-400'}`} />
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={formData.hours}
                    onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all ${
                      isDark
                        ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:ring-teal-500/50'
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-teal-500'
                    } focus:outline-none focus:ring-2 focus:border-transparent`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Minutes</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  step="15"
                  value={formData.minutes}
                  onChange={(e) => setFormData({ ...formData, minutes: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border transition-all ${
                    isDark
                      ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:ring-teal-500/50'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-teal-500'
                  } focus:outline-none focus:ring-2 focus:border-transparent`}
                />
              </div>

              <div>
                <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Units</label>
                <input
                  type="number"
                  value={formData.units}
                  onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                  placeholder="0"
                  className={`w-full px-4 py-3 rounded-xl border transition-all ${
                    isDark
                      ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:ring-teal-500/50'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-teal-500'
                  } focus:outline-none focus:ring-2 focus:border-transparent`}
                />
              </div>

              <div>
                <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border transition-all ${
                    isDark
                      ? 'bg-slate-900/50 border-slate-700 text-white focus:ring-teal-500/50'
                      : 'bg-gray-50 border-gray-200 text-gray-900 focus:ring-teal-500'
                  } focus:outline-none focus:ring-2 focus:border-transparent`}
                >
                  <option value="">Select</option>
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className={`block text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Due Date</label>
              <div className="relative">
                <Calendar size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-gray-400'}`} />
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all ${
                    isDark
                      ? 'bg-slate-900/50 border-slate-700 text-white focus:ring-teal-500/50'
                      : 'bg-gray-50 border-gray-200 text-gray-900 focus:ring-teal-500'
                  } focus:outline-none focus:ring-2 focus:border-transparent`}
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Notes</label>
                <span className={`text-xs ${charCount > maxChars * 0.9 ? 'text-orange-500' : isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                  {charCount}/{maxChars}
                </span>
              </div>
              <textarea
                value={formData.notes}
                onChange={handleNotesChange}
                placeholder="Add any additional notes or comments..."
                rows={4}
                className={`w-full px-4 py-3 rounded-xl border transition-all resize-none ${
                  isDark
                    ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:ring-teal-500/50'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-teal-500'
                } focus:outline-none focus:ring-2 focus:border-transparent`}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClear}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl transition-all border ${
                  isDark
                    ? 'bg-slate-900/50 border-slate-700 text-slate-300 hover:bg-slate-900/70'
                    : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <RotateCcw size={18} />
                <span>Clear</span>
              </button>
              <button
                type="button"
                onClick={handleAddEntry}
                className="flex-[2] flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Save size={18} />
                <span>Add to Today's Worklog</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Today's Summary */}
        <div className={`backdrop-blur-xl rounded-2xl border shadow-xl overflow-hidden transition-colors duration-500 ${
          isDark
            ? 'bg-slate-800/90 border-slate-700'
            : 'bg-white/90 border-gray-200'
        }`}>
          <div className={`border-b px-6 py-5 transition-colors duration-500 ${
            isDark
              ? 'bg-slate-900/50 border-slate-700'
              : 'bg-gradient-to-r from-indigo-50 to-purple-50 border-gray-200'
          }`}>
            <h3 className={`text-xl mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Today's Summary</h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{todayEntries.length} {todayEntries.length === 1 ? 'entry' : 'entries'} added</p>
          </div>

          <div className={`p-6 space-y-6 max-h-[600px] overflow-y-auto`}>
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`rounded-xl p-4 border transition-colors ${
                isDark
                  ? 'bg-teal-900/20 border-teal-700/50'
                  : 'bg-gradient-to-br from-teal-50 to-emerald-50 border-teal-200'
              }`}>
                <Clock size={18} className={isDark ? 'text-teal-400 mb-2' : 'text-teal-600 mb-2'} />
                <p className={`text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`}>{todayStats.hoursTracked.toFixed(1)}h</p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Total Hours</p>
              </div>

              <div className={`rounded-xl p-4 border transition-colors ${
                isDark
                  ? 'bg-blue-900/20 border-blue-700/50'
                  : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200'
              }`}>
                <CheckCircle2 size={18} className={isDark ? 'text-blue-400 mb-2' : 'text-blue-600 mb-2'} />
                <p className={`text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`}>{todayStats.totalTasks}</p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Total Tasks</p>
              </div>

              <div className={`rounded-xl p-4 border transition-colors ${
                isDark
                  ? 'bg-purple-900/20 border-purple-700/50'
                  : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'
              }`}>
                <Target size={18} className={isDark ? 'text-purple-400 mb-2' : 'text-purple-600 mb-2'} />
                <p className={`text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`}>{todayStats.tasksCompleted}</p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Completed</p>
              </div>

              <div className={`rounded-xl p-4 border transition-colors ${
                isDark
                  ? 'bg-orange-900/20 border-orange-700/50'
                  : 'bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200'
              }`}>
                <Award size={18} className={isDark ? 'text-orange-400 mb-2' : 'text-orange-600 mb-2'} />
                <p className={`text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`}>{todayStats.totalUnits}</p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Total Units</p>
              </div>
            </div>

            {/* Entries List */}
            {todayEntries.length > 0 ? (
              <div className="space-y-3">
                <h4 className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Current Entries</h4>
                <AnimatePresence>
                  {todayEntries.map((entry) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`rounded-xl p-4 hover:opacity-75 transition-all group border ${
                        isDark
                          ? 'bg-slate-900/50 border-slate-700 hover:bg-slate-900/70'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className={`text-sm mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{entry.project}</p>
                          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{entry.task}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveEntry(entry.id)}
                          className={`p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100 ${
                            isDark ? 'hover:bg-red-900/30' : 'hover:bg-red-100'
                          }`}
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-1 text-xs rounded-lg bg-gradient-to-r ${getStatusColor(entry.status)} text-white`}>
                          {entry.status}
                        </span>
                        <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                          {parseFloat(entry.hours)}h {parseFloat(entry.minutes)}m
                        </span>
                        {entry.units && (
                          <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                            {entry.units} units
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  isDark
                    ? 'bg-slate-700'
                    : 'bg-gray-100'
                }`}>
                  <AlertCircle size={32} className={isDark ? 'text-slate-500' : 'text-gray-400'} />
                </div>
                <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>No entries yet</p>
                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Add your first entry to get started</p>
              </div>
            )}

            {/* Submit Button */}
            {todayEntries.length > 0 && (
              <button
                onClick={handleSubmitWorklog}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Send size={20} />
                <span className="font-medium">Submit Today's Worklog</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Analysis Modal */}
      <AnimatePresence>
        {submittedAnalysis && showSubmitSuccess && (
          <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-6 ${
              isDark ? 'bg-black/50' : 'bg-black/50'
            } backdrop-blur-sm`}
            onClick={() => setShowSubmitSuccess(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className={`rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden transition-colors ${
                isDark
                  ? 'bg-slate-800'
                  : 'bg-white'
              }`}
            >
              <div className={`border-b px-8 py-6 transition-colors ${
                isDark
                  ? 'bg-slate-900/50 border-slate-700'
                  : 'bg-gradient-to-r from-indigo-50 to-purple-50 border-gray-200'
              }`}>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={32} className="text-white" />
                  </div>
                  <div>
                    <h3 className={`text-2xl mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Worklog Submitted Successfully!</h3>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                      Submitted on {new Date(submittedAnalysis.submittedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-8 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]`}>
                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className={`rounded-xl p-6 text-center border transition-colors ${
                    isDark
                      ? 'bg-teal-900/20 border-teal-700/50'
                      : 'bg-gradient-to-br from-teal-50 to-emerald-50 border-teal-200'
                  }`}>
                    <Clock size={32} className={`${isDark ? 'text-teal-400' : 'text-teal-600'} mx-auto mb-3`} />
                    <p className={`text-3xl mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{submittedAnalysis.totalHours.toFixed(1)}h</p>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Total Hours</p>
                  </div>

                  <div className={`rounded-xl p-6 text-center border transition-colors ${
                    isDark
                      ? 'bg-blue-900/20 border-blue-700/50'
                      : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200'
                  }`}>
                    <BarChart3 size={32} className={`${isDark ? 'text-blue-400' : 'text-blue-600'} mx-auto mb-3`} />
                    <p className={`text-3xl mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{submittedAnalysis.totalTasks}</p>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Tasks Logged</p>
                  </div>

                  <div className={`rounded-xl p-6 text-center border transition-colors ${
                    isDark
                      ? 'bg-purple-900/20 border-purple-700/50'
                      : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'
                  }`}>
                    <Award size={32} className={`${isDark ? 'text-purple-400' : 'text-purple-600'} mx-auto mb-3`} />
                    <p className={`text-3xl mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{submittedAnalysis.totalUnits}</p>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Total Units</p>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setShowSubmitSuccess(false)}
                  className="w-full px-6 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Close Analysis
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
