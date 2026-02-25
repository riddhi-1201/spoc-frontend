import { useState } from "react";
import { Calendar, Building2, Wifi, Home as HomeIcon, AlertTriangle, List, X } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

interface RequestEntry {
  id: string;
  date: string;
  workMode: string;
  project: string;
  hours: string;
  status: "pending" | "approved" | "rejected";
  timestamp: string;
}

interface MissingEntryPageProps {
  isDark: boolean;
}

export function MissingEntryPage({ isDark }: MissingEntryPageProps) {
  const [showRequestedEntries, setShowRequestedEntries] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    workMode: "",
    project: "",
    task: "",
    hours: "",
    minutes: "",
    status: "",
    reason: "",
  });
  const [requestedEntries, setRequestedEntries] = useState<RequestEntry[]>([
    {
      id: "1",
      date: "Feb 18, 2026",
      workMode: "Remote",
      project: "Website Redesign",
      hours: "8h 30m",
      status: "pending",
      timestamp: "2 hours ago",
    },
    {
      id: "2",
      date: "Feb 17, 2026",
      workMode: "Office",
      project: "Mobile App",
      hours: "6h 15m",
      status: "approved",
      timestamp: "1 day ago",
    },
  ]);

  const validateForm = () => {
    if (!formData.date) {
      toast.error("Please select a date");
      return false;
    }
    if (!formData.workMode) {
      toast.error("Please select a work mode");
      return false;
    }
    if (!formData.project) {
      toast.error("Please enter a project name");
      return false;
    }
    if (!formData.task) {
      toast.error("Please select a task");
      return false;
    }
    if (!formData.hours || !formData.minutes) {
      toast.error("Please enter hours and minutes");
      return false;
    }
    if (!formData.status) {
      toast.error("Please select a status");
      return false;
    }
    if (!formData.reason.trim()) {
      toast.error("Please provide a reason for late entry");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const newEntry: RequestEntry = {
      id: String(Date.now()),
      date: new Date(formData.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      workMode: formData.workMode,
      project: formData.project,
      hours: `${formData.hours}h ${formData.minutes}m`,
      status: "pending",
      timestamp: "Just now",
    };
    setRequestedEntries([newEntry, ...requestedEntries]);
    handleClear();
    setShowRequestedEntries(true);
    toast.success("Missing entry request submitted successfully");
  };

  const handleClear = () => {
    setFormData({
      date: "",
      workMode: "",
      project: "",
      task: "",
      hours: "",
      minutes: "",
      status: "",
      reason: "",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-500";
      case "approved":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getWorkModeIcon = (mode: string) => {
    switch (mode) {
      case "Office":
        return <Building2 className="w-6 h-6" />;
      case "Remote":
        return <Wifi className="w-6 h-6" />;
      case "Hybrid":
        return <HomeIcon className="w-6 h-6" />;
      default:
        return null;
    }
  };

  const workModes = [
    { name: "Office", icon: Building2 },
    { name: "Remote", icon: Wifi },
    { name: "Hybrid", icon: HomeIcon },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h2 className={`text-2xl font-bold mb-1 ${isDark ? "text-[#F8FAFC]" : "text-[#0F172A]"}`}>
          Missing Entry
        </h2>
        <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Request approval for missed work log entry
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Form Card */}
        <div className="lg:col-span-8">
          <div className={`rounded-[18px] border p-6 shadow-sm transition-colors duration-300 ${
            isDark 
              ? "bg-[#1E293B] border-[#334155]" 
              : "bg-white border-[#E5E7EB]"
          }`}>
            {/* Header with View Button */}
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-semibold ${isDark ? "text-[#F8FAFC]" : "text-[#0F172A]"}`}>
                Missing Work Entry Request
              </h3>
              <Button
                variant="outline"
                onClick={() => setShowRequestedEntries(true)}
                className={`h-[36px] px-4 rounded-xl gap-2 transition-colors ${
                  isDark
                    ? "border-[#2563EB] text-[#2563EB] hover:bg-blue-600/10"
                    : "border-[#2563EB] text-[#2563EB] hover:bg-blue-50"
                }`}
              >
                <List className="w-4 h-4" />
                View Requested Entries
              </Button>
            </div>

            {/* Warning Information Strip */}
            <div className={`rounded-xl p-4 mb-6 flex items-start gap-3 ${
              isDark 
                ? "bg-amber-900/20 border border-amber-800/30" 
                : "bg-[#FEF3C7] border border-[#FDE68A]"
            }`}>
              <div className={`p-2 rounded-lg flex-shrink-0 ${
                isDark ? "bg-amber-900/30" : "bg-amber-600/10"
              }`}>
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${isDark ? "text-amber-300" : "text-amber-900"}`}>
                  You have 2 remaining missing entry requests this week.
                </p>
                <p className={`text-xs mt-1 ${isDark ? "text-amber-400/70" : "text-amber-800/70"}`}>
                  Requests beyond the limit require manager approval.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Row 1: Date Picker */}
              <div>
                <Label htmlFor="date" className={`text-sm font-medium mb-2 block ${
                  isDark ? "text-[#F8FAFC]" : "text-[#0F172A]"
                }`}>
                  Exact Date
                </Label>
                <div className="relative">
                  <input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={`w-full h-[44px] px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-colors ${
                      isDark
                        ? "bg-[#0F172A] border-[#334155] text-[#F8FAFC]"
                        : "bg-[#F9FAFB] border-[#E5E7EB]"
                    }`}
                  />
                  <Calendar className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`} />
                </div>
              </div>

              {/* Row 2: Work Mode Selection */}
              <div>
                <Label className={`text-sm font-medium mb-2 block ${
                  isDark ? "text-[#F8FAFC]" : "text-[#0F172A]"
                }`}>
                  Work Mode
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {workModes.map((mode) => {
                    const Icon = mode.icon;
                    const isSelected = formData.workMode === mode.name;
                    return (
                      <button
                        key={mode.name}
                        onClick={() => setFormData({ ...formData, workMode: mode.name })}
                        className={`h-[88px] rounded-xl font-medium transition-all flex flex-col items-center justify-center gap-2 ${
                          isSelected
                            ? "bg-[#2563EB] text-white border-2 border-[#2563EB]"
                            : isDark
                            ? "bg-[#0F172A] text-[#F8FAFC] border border-[#334155] hover:border-gray-500"
                            : "bg-[#F9FAFB] text-[#0F172A] border border-[#E5E7EB] hover:border-gray-300"
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                        <span className="text-sm">{mode.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 3: Project and Task */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="project" className={`text-sm font-medium mb-2 block ${
                    isDark ? "text-[#F8FAFC]" : "text-[#0F172A]"
                  }`}>
                    Project
                  </Label>
                  <input
                    id="project"
                    type="text"
                    placeholder="Enter project name"
                    value={formData.project}
                    onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                    className={`w-full h-[44px] px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-colors ${
                      isDark
                        ? "bg-[#0F172A] border-[#334155] text-[#F8FAFC] placeholder:text-gray-500"
                        : "bg-[#F9FAFB] border-[#E5E7EB]"
                    }`}
                  />
                </div>
                <div>
                  <Label htmlFor="task" className={`text-sm font-medium mb-2 block ${
                    isDark ? "text-[#F8FAFC]" : "text-[#0F172A]"
                  }`}>
                    Task
                  </Label>
                  <select
                    id="task"
                    value={formData.task}
                    onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                    className={`w-full h-[44px] px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 appearance-none cursor-pointer transition-colors ${
                      isDark
                        ? "bg-[#0F172A] border-[#334155] text-[#F8FAFC]"
                        : "bg-[#F9FAFB] border-[#E5E7EB]"
                    }`}
                  >
                    <option value="">Select task</option>
                    <option value="development">Development</option>
                    <option value="design">Design</option>
                    <option value="testing">Testing</option>
                    <option value="meeting">Meeting</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Hours, Minutes, Status */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="hours" className={`text-sm font-medium mb-2 block ${
                    isDark ? "text-[#F8FAFC]" : "text-[#0F172A]"
                  }`}>
                    Hours
                  </Label>
                  <select
                    id="hours"
                    value={formData.hours}
                    onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                    className={`w-full h-[44px] px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 appearance-none cursor-pointer transition-colors ${
                      isDark
                        ? "bg-[#0F172A] border-[#334155] text-[#F8FAFC]"
                        : "bg-[#F9FAFB] border-[#E5E7EB]"
                    }`}
                  >
                    <option value="">0</option>
                    {Array.from({ length: 24 }, (_, i) => i + 1).map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="minutes" className={`text-sm font-medium mb-2 block ${
                    isDark ? "text-[#F8FAFC]" : "text-[#0F172A]"
                  }`}>
                    Minutes
                  </Label>
                  <select
                    id="minutes"
                    value={formData.minutes}
                    onChange={(e) => setFormData({ ...formData, minutes: e.target.value })}
                    className={`w-full h-[44px] px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 appearance-none cursor-pointer transition-colors ${
                      isDark
                        ? "bg-[#0F172A] border-[#334155] text-[#F8FAFC]"
                        : "bg-[#F9FAFB] border-[#E5E7EB]"
                    }`}
                  >
                    <option value="">0</option>
                    {[15, 30, 45].map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="status" className={`text-sm font-medium mb-2 block ${
                    isDark ? "text-[#F8FAFC]" : "text-[#0F172A]"
                  }`}>
                    Status
                  </Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className={`w-full h-[44px] px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 appearance-none cursor-pointer transition-colors ${
                      isDark
                        ? "bg-[#0F172A] border-[#334155] text-[#F8FAFC]"
                        : "bg-[#F9FAFB] border-[#E5E7EB]"
                    }`}
                  >
                    <option value="">Select</option>
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>
              </div>

              {/* Row 5: Reason for Late Entry */}
              <div>
                <Label htmlFor="reason" className={`text-sm font-medium mb-2 block ${
                  isDark ? "text-[#F8FAFC]" : "text-[#0F172A]"
                }`}>
                  Reason for Late Entry
                </Label>
                <div className="relative">
                  <textarea
                    id="reason"
                    placeholder="Explain why you're submitting this entry late..."
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    maxLength={500}
                    className={`w-full h-[120px] px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 resize-none transition-colors ${
                      isDark
                        ? "bg-[#0F172A] border-[#334155] text-[#F8FAFC] placeholder:text-gray-500"
                        : "bg-[#F9FAFB] border-[#E5E7EB]"
                    }`}
                  />
                  <span className={`absolute bottom-3 right-4 text-xs ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}>
                    {formData.reason.length}/500
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="secondary"
                  onClick={handleClear}
                  className={`h-[44px] px-6 rounded-xl transition-colors ${
                    isDark
                      ? "bg-[#334155] hover:bg-[#475569] text-[#F8FAFC]"
                      : "bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#0F172A]"
                  }`}
                >
                  Clear
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="h-[44px] px-6 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white shadow-md"
                >
                  Request Entry
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Requested Entries Card (Sliding Panel) */}
        <AnimatePresence>
          {showRequestedEntries && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="lg:col-span-4 fixed lg:relative top-[88px] lg:top-0 right-0 w-full lg:w-auto max-w-md lg:max-w-none h-[calc(100vh-104px)] lg:h-auto z-40 lg:z-auto"
            >
              <div className={`rounded-[18px] border p-6 shadow-sm h-full transition-colors duration-300 ${
                isDark 
                  ? "bg-[#1E293B] border-[#334155]" 
                  : "bg-white border-[#E5E7EB]"
              }`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-lg font-semibold ${isDark ? "text-[#F8FAFC]" : "text-[#0F172A]"}`}>
                    Requested Entries
                  </h3>
                  <button
                    onClick={() => setShowRequestedEntries(false)}
                    className={`p-1 rounded-lg transition-colors ${
                      isDark ? "hover:bg-[#334155]" : "hover:bg-gray-100"
                    }`}
                  >
                    <X className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
                  </button>
                </div>

                <div className="space-y-3 max-h-[calc(100vh-280px)] lg:max-h-[600px] overflow-y-auto">
                  {requestedEntries.length === 0 ? (
                    <div className="text-center py-12">
                      <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                        No missing entry requests yet.
                      </p>
                    </div>
                  ) : (
                    requestedEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className={`rounded-xl border p-4 transition-colors ${
                          isDark
                            ? "bg-[#0F172A] border-[#334155] hover:bg-[#1a2332]"
                            : "bg-[#F9FAFB] border-[#E5E7EB] hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <p className={`font-medium text-sm ${isDark ? "text-[#F8FAFC]" : "text-[#0F172A]"}`}>
                              {entry.project}
                            </p>
                            <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                              {entry.date}
                            </p>
                          </div>
                          <span
                            className={`${getStatusColor(
                              entry.status
                            )} text-white text-xs px-2.5 py-1 rounded-full capitalize`}
                          >
                            {entry.status}
                          </span>
                        </div>

                        {/* Work Mode Icon */}
                        <div className={`flex items-center gap-2 mb-3 pb-3 border-b ${
                          isDark ? "border-[#334155]" : "border-gray-200"
                        }`}>
                          <div className={`p-2 rounded-lg ${
                            isDark ? "bg-[#1E293B]" : "bg-white"
                          }`}>
                            {getWorkModeIcon(entry.workMode)}
                          </div>
                          <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                            {entry.workMode}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-[#2563EB]">{entry.hours}</p>
                          <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                            {entry.timestamp}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Overlay Backdrop */}
      {showRequestedEntries && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30 top-[72px]"
          onClick={() => setShowRequestedEntries(false)}
        />
      )}
    </div>
  );
}
