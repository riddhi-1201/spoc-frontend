import { useState } from "react";
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  CalendarIcon,
  Building2,
  Wifi,
  Home as HomeIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { motion, AnimatePresence } from "motion/react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { toast } from "sonner";
import { format } from "date-fns";

interface WorkEntry {
  id: string;
  workMode: "Office" | "Remote" | "WFH";
  project: string;
  task: string;
  hours: string;
  units: string;
  status: "pending" | "completed" | "delayed";
  dueDate: string;
}

interface Employee {
  id: string;
  name: string;
  initials: string;
  totalHours: number;
  pending: number;
  completed: number;
  delayed: number;
  entries: WorkEntry[];
  date: string;
}

interface SPOCDashboardProps {
  isDark: boolean;
}

export function SPOCDashboard({ isDark }: SPOCDashboardProps) {
  const [expandedEmployee, setExpandedEmployee] = useState<string | null>(null);
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "1",
      name: "John Smith",
      initials: "JS",
      totalHours: 8,
      pending: 2,
      completed: 3,
      delayed: 0,
      date: "Feb 24, 2026",
      entries: [
        {
          id: "e1",
          workMode: "Office",
          project: "Website Redesign",
          task: "Frontend Development",
          hours: "4",
          units: "hours",
          status: "pending",
          dueDate: "Feb 24, 2026",
        },
        {
          id: "e2",
          workMode: "Remote",
          project: "Mobile App",
          task: "UI Design",
          hours: "4",
          units: "hours",
          status: "pending",
          dueDate: "Feb 24, 2026",
        },
        {
          id: "e3",
          workMode: "Office",
          project: "Database Migration",
          task: "Backend Work",
          hours: "3",
          units: "hours",
          status: "completed",
          dueDate: "Feb 23, 2026",
        },
      ],
    },
    {
      id: "2",
      name: "Sarah Johnson",
      initials: "SJ",
      totalHours: 7.5,
      pending: 1,
      completed: 4,
      delayed: 1,
      date: "Feb 24, 2026",
      entries: [
        {
          id: "e4",
          workMode: "WFH",
          project: "API Integration",
          task: "Development",
          hours: "5",
          units: "hours",
          status: "pending",
          dueDate: "Feb 24, 2026",
        },
        {
          id: "e5",
          workMode: "Remote",
          project: "Documentation",
          task: "Writing",
          hours: "2.5",
          units: "hours",
          status: "completed",
          dueDate: "Feb 24, 2026",
        },
      ],
    },
    {
      id: "3",
      name: "Michael Chen",
      initials: "MC",
      totalHours: 9,
      pending: 3,
      completed: 2,
      delayed: 0,
      date: "Feb 24, 2026",
      entries: [
        {
          id: "e6",
          workMode: "Office",
          project: "Cloud Infrastructure",
          task: "DevOps",
          hours: "6",
          units: "hours",
          status: "pending",
          dueDate: "Feb 24, 2026",
        },
        {
          id: "e7",
          workMode: "Office",
          project: "Security Audit",
          task: "Testing",
          hours: "3",
          units: "hours",
          status: "pending",
          dueDate: "Feb 24, 2026",
        },
      ],
    },
  ]);

  const [filters, setFilters] = useState({
    employee: "All Employees",
    status: "All Status",
    workMode: "All Modes",
  });

  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Calculate analytics
  const totalEmployees = employees.length;
  const totalCompleted = employees.reduce((sum, emp) => sum + emp.completed, 0);
  const totalDelayed = employees.reduce((sum, emp) => sum + emp.delayed, 0);
  const totalPending = employees.reduce((sum, emp) => sum + emp.pending, 0);

  const handleApprove = (employeeId: string, entryId: string) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === employeeId) {
          return {
            ...emp,
            entries: emp.entries.map((entry) =>
              entry.id === entryId ? { ...entry, status: "completed" as const } : entry
            ),
            pending: emp.pending - 1,
            completed: emp.completed + 1,
          };
        }
        return emp;
      })
    );
    toast.success("Entry approved successfully");
  };

  const handleReject = (employeeId: string, entryId: string) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === employeeId) {
          return {
            ...emp,
            entries: emp.entries.map((entry) =>
              entry.id === entryId ? { ...entry, status: "delayed" as const } : entry
            ),
            pending: emp.pending - 1,
            delayed: emp.delayed + 1,
          };
        }
        return emp;
      })
    );
    toast.error("Entry marked as delayed");
  };

  const handleApproveAll = (employeeId: string) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === employeeId) {
          const pendingCount = emp.entries.filter((e) => e.status === "pending").length;
          return {
            ...emp,
            entries: emp.entries.map((entry) =>
              entry.status === "pending" ? { ...entry, status: "completed" as const } : entry
            ),
            pending: 0,
            completed: emp.completed + pendingCount,
          };
        }
        return emp;
      })
    );
    toast.success("All pending entries approved");
  };

  const getWorkModeIcon = (mode: string) => {
    switch (mode) {
      case "Office":
        return <Building2 className="w-4 h-4" />;
      case "Remote":
        return <Wifi className="w-4 h-4" />;
      case "WFH":
        return <HomeIcon className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const stats = [
    {
      id: "employees",
      label: "Total Employees Under SPOC",
      value: totalEmployees,
      icon: Users,
      iconBg: isDark ? "bg-purple-400/20" : "bg-white",
      iconColor: isDark ? "text-white" : "text-[#5dd4e8]",
      cardBg: isDark ? "bg-gradient-to-br from-purple-600/30 to-indigo-700/30" : "bg-gradient-to-br from-[#5dd4e8] to-[#4bc4d8]",
      textColor: isDark ? "text-white" : "text-white",
      labelColor: isDark ? "text-gray-300" : "text-white/90",
      details: employees.map((emp) => ({
        name: emp.name,
        subtitle: `${emp.pending} pending, ${emp.completed} completed`,
      })),
    },
    {
      id: "completed",
      label: "Completed Entries",
      value: totalCompleted,
      icon: CheckCircle2,
      iconBg: isDark ? "bg-green-400/20" : "bg-white",
      iconColor: isDark ? "text-white" : "text-[#3cc98a]",
      cardBg: isDark ? "bg-gradient-to-br from-emerald-600/30 to-green-700/30" : "bg-gradient-to-br from-[#3cc98a] to-[#2eb87a]",
      textColor: isDark ? "text-white" : "text-white",
      labelColor: isDark ? "text-gray-300" : "text-white/90",
      details: employees
        .filter((emp) => emp.completed > 0)
        .map((emp) => ({
          name: emp.name,
          subtitle: `${emp.completed} completed`,
        })),
    },
    {
      id: "delayed",
      label: "Delayed Entries",
      value: totalDelayed,
      icon: XCircle,
      iconBg: isDark ? "bg-pink-400/20" : "bg-white",
      iconColor: isDark ? "text-white" : "text-[#ff7e8b]",
      cardBg: isDark ? "bg-gradient-to-br from-pink-600/30 to-rose-700/30" : "bg-gradient-to-br from-[#ff7e8b] to-[#ff6b7a]",
      textColor: isDark ? "text-white" : "text-white",
      labelColor: isDark ? "text-gray-300" : "text-white/90",
      details: employees
        .filter((emp) => emp.delayed > 0)
        .map((emp) => ({
          name: emp.name,
          subtitle: `${emp.delayed} delayed`,
        })),
    },
    {
      id: "pending",
      label: "Pending Entries",
      value: totalPending,
      icon: Clock,
      iconBg: isDark ? "bg-blue-400/20" : "bg-white",
      iconColor: isDark ? "text-white" : "text-[#3e4c7e]",
      cardBg: isDark ? "bg-gradient-to-br from-blue-700/30 to-indigo-800/30" : "bg-gradient-to-br from-[#3e4c7e] to-[#2e3c6e]",
      textColor: isDark ? "text-white" : "text-white",
      labelColor: isDark ? "text-gray-300" : "text-white/90",
      details: employees
        .filter((emp) => emp.pending > 0)
        .map((emp) => ({
          name: emp.name,
          subtitle: `${emp.pending} pending`,
        })),
    },
  ];

  const chartData = [
    { name: "Completed", value: totalCompleted, color: "#10b981" },
    { name: "Delayed", value: totalDelayed, color: "#ef4444" },
  ];

  const filterOptions = {
    employee: ["All Employees", ...employees.map((e) => e.name)],
    status: ["All Status", "Completed", "Pending", "Delayed"],
    workMode: ["All Modes", "Office", "Remote", "WFH"],
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* Analytics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHoveredStat(stat.id)}
              onMouseLeave={() => setHoveredStat(null)}
              className="relative"
            >
              <div
                className={`rounded-[20px] p-6 shadow-lg transition-all duration-300 ${stat.cardBg} ${
                  hoveredStat === stat.id ? "transform -translate-y-2 shadow-xl" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className={`text-sm font-semibold mb-2 ${stat.labelColor}`}>
                      {stat.label}
                    </p>
                    <motion.p
                      key={stat.value}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`text-4xl font-extrabold ${stat.textColor}`}
                    >
                      {stat.value}
                    </motion.p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.iconBg}`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>

                {/* Tooltip Dropdown */}
                <AnimatePresence>
                  {hoveredStat === stat.id && stat.details.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`absolute top-full mt-2 left-0 right-0 rounded-xl border p-3 shadow-lg z-10 ${
                        isDark
                          ? "bg-slate-800 border-slate-700"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {stat.details.map((detail, idx) => (
                          <div
                            key={idx}
                            className={`text-xs p-2 rounded-lg ${
                              isDark ? "bg-slate-900/50" : "bg-gray-50"
                            }`}
                          >
                            <p className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                              {detail.name}
                            </p>
                            <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
                              {detail.subtitle}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Smart Filter Bar */}
      <div
        className={`rounded-[20px] border p-4 shadow-sm transition-colors duration-300 ${
          isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex flex-wrap gap-3">
          {/* Date Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-[14px] border transition-all duration-300 ${
                  isDark
                    ? "border-slate-700 hover:border-purple-400 bg-slate-900/50"
                    : "border-gray-200 hover:border-purple-300 bg-gray-50"
                }`}
              >
                <CalendarIcon className="w-4 h-4" />
                <span className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                  Date: {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                </span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Employees Filter */}
          <div className="relative">
            <button
              onMouseEnter={() => setActiveFilter("employee")}
              onMouseLeave={() => setActiveFilter(null)}
              className={`flex items-center gap-2 px-4 py-2 rounded-[14px] border transition-all duration-300 ${
                activeFilter === "employee"
                  ? "border-purple-500 shadow-lg shadow-purple-500/20 transform scale-105"
                  : isDark
                  ? "border-slate-700 hover:border-purple-400 bg-slate-900/50"
                  : "border-gray-200 hover:border-purple-300 bg-gray-50"
              }`}
            >
              <Users className="w-4 h-4" />
              <span className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                Employees: {filters.employee}
              </span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {/* Employee Dropdown */}
            <AnimatePresence>
              {activeFilter === "employee" && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute top-full mt-2 left-0 min-w-[200px] rounded-xl border shadow-xl z-20 ${
                    isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
                  }`}
                >
                  <div className="p-2 space-y-1">
                    {filterOptions.employee.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setFilters((prev) => ({ ...prev, employee: option }));
                          setActiveFilter(null);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          filters.employee === option
                            ? "bg-purple-100 text-purple-700"
                            : isDark
                            ? "hover:bg-slate-700 text-white"
                            : "hover:bg-gray-100 text-gray-900"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button
              onMouseEnter={() => setActiveFilter("status")}
              onMouseLeave={() => setActiveFilter(null)}
              className={`flex items-center gap-2 px-4 py-2 rounded-[14px] border transition-all duration-300 ${
                activeFilter === "status"
                  ? "border-purple-500 shadow-lg shadow-purple-500/20 transform scale-105"
                  : isDark
                  ? "border-slate-700 hover:border-purple-400 bg-slate-900/50"
                  : "border-gray-200 hover:border-purple-300 bg-gray-50"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                Status: {filters.status}
              </span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {/* Status Dropdown */}
            <AnimatePresence>
              {activeFilter === "status" && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute top-full mt-2 left-0 min-w-[200px] rounded-xl border shadow-xl z-20 ${
                    isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
                  }`}
                >
                  <div className="p-2 space-y-1">
                    {filterOptions.status.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setFilters((prev) => ({ ...prev, status: option }));
                          setActiveFilter(null);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          filters.status === option
                            ? "bg-purple-100 text-purple-700"
                            : isDark
                            ? "hover:bg-slate-700 text-white"
                            : "hover:bg-gray-100 text-gray-900"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Work Mode Filter */}
          <div className="relative">
            <button
              onMouseEnter={() => setActiveFilter("workMode")}
              onMouseLeave={() => setActiveFilter(null)}
              className={`flex items-center gap-2 px-4 py-2 rounded-[14px] border transition-all duration-300 ${
                activeFilter === "workMode"
                  ? "border-purple-500 shadow-lg shadow-purple-500/20 transform scale-105"
                  : isDark
                  ? "border-slate-700 hover:border-purple-400 bg-slate-900/50"
                  : "border-gray-200 hover:border-purple-300 bg-gray-50"
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                Mode: {filters.workMode}
              </span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {/* Work Mode Dropdown */}
            <AnimatePresence>
              {activeFilter === "workMode" && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute top-full mt-2 left-0 min-w-[200px] rounded-xl border shadow-xl z-20 ${
                    isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
                  }`}
                >
                  <div className="p-2 space-y-1">
                    {filterOptions.workMode.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setFilters((prev) => ({ ...prev, workMode: option }));
                          setActiveFilter(null);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          filters.workMode === option
                            ? "bg-purple-100 text-purple-700"
                            : isDark
                            ? "hover:bg-slate-700 text-white"
                            : "hover:bg-gray-100 text-gray-900"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Employee Cards */}
      <div className="space-y-4">
        {employees.map((employee, index) => {
          const isExpanded = expandedEmployee === employee.id;
          return (
            <motion.div
              key={employee.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-[20px] border shadow-sm transition-all duration-300 overflow-hidden ${
                isExpanded ? "shadow-lg" : "hover:shadow-md hover:-translate-y-1"
              } ${isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-gray-200"}`}
            >
              {/* Card Header */}
              <button
                onClick={() => setExpandedEmployee(isExpanded ? null : employee.id)}
                className="w-full p-6 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                    {employee.initials}
                  </div>
                  <div className="text-left">
                    <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                      {employee.name}
                    </h3>
                    <p className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      {employee.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <p className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>Total Hours</p>
                      <p className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                        {employee.totalHours}h
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      isDark ? "bg-amber-900/30 text-amber-300" : "bg-amber-100 text-amber-700"
                    }`}>
                      {employee.pending} Pending
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      isDark ? "bg-green-900/30 text-green-300" : "bg-green-100 text-green-700"
                    }`}>
                      {employee.completed} Completed
                    </div>
                    {employee.delayed > 0 && (
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        isDark ? "bg-red-900/30 text-red-300" : "bg-red-100 text-red-700"
                      }`}>
                        {employee.delayed} Delayed
                      </div>
                    )}
                  </div>

                  {employee.pending > 0 && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApproveAll(employee.id);
                      }}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:shadow-lg transition-all hover:scale-105"
                    >
                      Approve All Pending
                    </Button>
                  )}

                  <div className={isDark ? "text-gray-400" : "text-gray-600"}>
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </button>

              {/* Expanded Content - Table */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="overflow-hidden"
                  >
                    <div className={`p-6 pt-0 border-t ${isDark ? "border-slate-700" : "border-gray-200"}`}>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className={`text-left text-sm font-bold ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                              <th className="pb-4 pr-4">Work Mode</th>
                              <th className="pb-4 pr-4">Project</th>
                              <th className="pb-4 pr-4">Task</th>
                              <th className="pb-4 pr-4">Hours</th>
                              <th className="pb-4 pr-4">Units</th>
                              <th className="pb-4 pr-4">Status</th>
                              <th className="pb-4 pr-4">Due Date</th>
                              <th className="pb-4">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {employee.entries.map((entry) => (
                              <tr
                                key={entry.id}
                                className={`border-t transition-colors ${
                                  isDark
                                    ? "border-slate-700 hover:bg-slate-900/50"
                                    : "border-gray-200 hover:bg-gray-50"
                                }`}
                              >
                                <td className="py-4 pr-4">
                                  <div className="flex items-center gap-2">
                                    {getWorkModeIcon(entry.workMode)}
                                    <span className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                                      {entry.workMode}
                                    </span>
                                  </div>
                                </td>
                                <td className={`py-4 pr-4 text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                                  {entry.project}
                                </td>
                                <td className={`py-4 pr-4 text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                                  {entry.task}
                                </td>
                                <td className={`py-4 pr-4 text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                                  {entry.hours}
                                </td>
                                <td className={`py-4 pr-4 text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                                  {entry.units}
                                </td>
                                <td className="py-4 pr-4">
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                      entry.status === "pending"
                                        ? isDark ? "bg-amber-900/30 text-amber-300" : "bg-amber-100 text-amber-700"
                                        : entry.status === "completed"
                                        ? isDark ? "bg-green-900/30 text-green-300" : "bg-green-100 text-green-700"
                                        : isDark ? "bg-red-900/30 text-red-300" : "bg-red-100 text-red-700"
                                    }`}
                                  >
                                    {entry.status}
                                  </span>
                                </td>
                                <td className={`py-4 pr-4 text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                  {entry.dueDate}
                                </td>
                                <td className="py-4">
                                  {entry.status === "pending" && (
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => handleApprove(employee.id, entry.id)}
                                        className="px-3 py-1.5 bg-green-500 text-white font-semibold rounded-full text-xs hover:bg-green-600 transition-all hover:scale-105 hover:shadow-lg hover:shadow-green-500/50"
                                      >
                                        ✓ Approve
                                      </button>
                                      <button
                                        onClick={() => handleReject(employee.id, entry.id)}
                                        className="px-3 py-1.5 bg-red-500 text-white font-semibold rounded-full text-xs hover:bg-red-600 transition-all hover:scale-105 hover:shadow-lg hover:shadow-red-500/50"
                                      >
                                        ✕ Reject
                                      </button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Daily SPOC Activity Summary */}
      <div
        className={`rounded-[20px] border p-6 shadow-sm transition-colors duration-300 ${
          isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-gray-200"
        }`}
      >
        <h3 className={`text-xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>
          Today's SPOC Activity
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="space-y-4">
              <div className={`p-4 rounded-xl ${isDark ? "bg-slate-900/50" : "bg-green-50"}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className={`text-sm font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>Entries Completed Today</p>
                  <CheckCircle2 className={`w-5 h-5 ${isDark ? "text-green-400" : "text-green-600"}`} />
                </div>
                <p className={`text-3xl font-extrabold ${isDark ? "text-white" : "text-gray-900"}`}>
                  {totalCompleted}
                </p>
              </div>

              <div className={`p-4 rounded-xl ${isDark ? "bg-slate-900/50" : "bg-red-50"}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className={`text-sm font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>Entries Delayed Today</p>
                  <XCircle className={`w-5 h-5 ${isDark ? "text-red-400" : "text-red-600"}`} />
                </div>
                <p className={`text-3xl font-extrabold ${isDark ? "text-white" : "text-gray-900"}`}>
                  {totalDelayed}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
