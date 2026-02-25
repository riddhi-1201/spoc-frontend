import { useState } from "react";
import { motion } from "motion/react";
import { Calendar, Users, CheckCircle2, Briefcase, ChevronDown } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";

interface FilterBarProps {
  employees: string;
  status: string;
  workMode: string;
  onFilterChange: (filter: string, value: string) => void;
}

export function FilterBar({
  employees,
  status,
  workMode,
  onFilterChange,
}: FilterBarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isEmployeeOpen, setIsEmployeeOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isWorkModeOpen, setIsWorkModeOpen] = useState(false);

  // Mock employee list
  const employeesList = [
    { id: "all", name: "All Employees" },
    { id: "john", name: "John Smith" },
    { id: "sarah", name: "Sarah Johnson" },
    { id: "mike", name: "Mike Wilson" },
    { id: "emma", name: "Emma Davis" },
  ];

  const statusOptions = [
    { id: "all", label: "All Status", color: "text-muted-foreground" },
    { id: "pending", label: "Pending", color: "text-[#F59E0B]" },
    { id: "approved", label: "Completed", color: "text-[#22C55E]" },
    { id: "rejected", label: "Delayed", color: "text-[#EF4444]" },
  ];

  const workModeOptions = [
    { id: "all", label: "All Modes" },
    { id: "office", label: "Office" },
    { id: "wfh", label: "WFH" },
    { id: "hybrid", label: "OT Office" },
    { id: "remote", label: "Remote" },
  ];

  const getSelectedEmployee = () => {
    return employeesList.find((e) => e.id === employees)?.name || "All Employees";
  };

  const getSelectedStatus = () => {
    return statusOptions.find((s) => s.id === status)?.label || "All Status";
  };

  const getSelectedWorkMode = () => {
    return workModeOptions.find((w) => w.id === workMode)?.label || "All Modes";
  };

  return (
    <div className="bg-card rounded-[20px] p-6 border border-border shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Date Filter */}
        <Popover.Root open={isDateOpen} onOpenChange={setIsDateOpen}>
          <Popover.Trigger asChild>
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-muted/40 to-muted/20 border border-border hover:border-[#6366F1] hover:shadow-lg transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#6366F1]/15 to-[#8B5CF6]/15 flex items-center justify-center group-hover:scale-110 transition-transform border border-[#6366F1]/20">
                <Calendar className="w-5 h-5 text-[#6366F1] dark:text-[#A78BFA]" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs text-slate-600 dark:text-slate-400 font-bold dark:font-extrabold">Date</p>
                <p className="text-sm font-bold text-slate-800 dark:text-white dark:font-extrabold">
                  {selectedDate ? format(selectedDate, "MMM dd, yyyy") : "Select Date"}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </motion.button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              className="bg-card border border-border rounded-[20px] shadow-xl p-4 z-50 animate-in fade-in-0 zoom-in-95"
              sideOffset={8}
            >
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setIsDateOpen(false);
                  // You can add date filter logic here
                }}
                className="text-foreground"
                classNames={{
                  months: "flex flex-col space-y-4",
                  month: "space-y-4",
                  caption: "flex justify-center pt-1 relative items-center",
                  caption_label: "text-sm font-medium",
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                  row: "flex w-full mt-2",
                  cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md",
                  day_selected:
                    "bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white hover:bg-gradient-to-r hover:from-[#6366F1] hover:to-[#8B5CF6]",
                  day_today: "bg-accent text-accent-foreground",
                  day_outside: "text-muted-foreground opacity-50",
                  day_disabled: "text-muted-foreground opacity-50",
                  day_hidden: "invisible",
                }}
              />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>

        {/* Employees Filter */}
        <Popover.Root open={isEmployeeOpen} onOpenChange={setIsEmployeeOpen}>
          <Popover.Trigger asChild>
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/30 border border-border hover:border-[#6366F1] hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#6366F1]/10 to-[#8B5CF6]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5 text-[#6366F1]" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs text-muted-foreground font-medium">Employees</p>
                <p className="text-sm font-semibold text-foreground">{getSelectedEmployee()}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </motion.button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              className="bg-card border border-border rounded-[20px] shadow-xl p-3 z-50 animate-in fade-in-0 zoom-in-95 w-64"
              sideOffset={8}
            >
              <div className="space-y-1 max-h-[300px] overflow-y-auto">
                {employeesList.map((emp) => (
                  <motion.button
                    key={emp.id}
                    onClick={() => {
                      onFilterChange("employees", emp.id);
                      setIsEmployeeOpen(false);
                    }}
                    whileHover={{ x: 4 }}
                    className={`w-full text-left px-4 py-2.5 rounded-lg transition-all ${
                      employees === emp.id
                        ? "bg-gradient-to-r from-[#6366F1]/10 to-[#8B5CF6]/10 text-[#6366F1] font-medium"
                        : "text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {emp.name}
                  </motion.button>
                ))}
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>

        {/* Status Filter */}
        <Popover.Root open={isStatusOpen} onOpenChange={setIsStatusOpen}>
          <Popover.Trigger asChild>
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/30 border border-border hover:border-[#6366F1] hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#6366F1]/10 to-[#8B5CF6]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-5 h-5 text-[#6366F1]" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs text-muted-foreground font-medium">Status</p>
                <p className="text-sm font-semibold text-foreground">{getSelectedStatus()}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </motion.button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              className="bg-card border border-border rounded-[20px] shadow-xl p-3 z-50 animate-in fade-in-0 zoom-in-95 w-56"
              sideOffset={8}
            >
              <div className="space-y-1">
                {statusOptions.map((opt) => (
                  <motion.button
                    key={opt.id}
                    onClick={() => {
                      onFilterChange("status", opt.id);
                      setIsStatusOpen(false);
                    }}
                    whileHover={{ x: 4 }}
                    className={`w-full text-left px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
                      status === opt.id
                        ? "bg-gradient-to-r from-[#6366F1]/10 to-[#8B5CF6]/10 text-[#6366F1] font-medium"
                        : "text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        opt.id === "pending"
                          ? "bg-[#F59E0B]"
                          : opt.id === "approved"
                          ? "bg-[#22C55E]"
                          : opt.id === "rejected"
                          ? "bg-[#EF4444]"
                          : "bg-muted-foreground"
                      }`}
                    />
                    {opt.label}
                  </motion.button>
                ))}
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>

        {/* Work Mode Filter */}
        <Popover.Root open={isWorkModeOpen} onOpenChange={setIsWorkModeOpen}>
          <Popover.Trigger asChild>
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/30 border border-border hover:border-[#6366F1] hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#6366F1]/10 to-[#8B5CF6]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Briefcase className="w-5 h-5 text-[#6366F1]" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs text-muted-foreground font-medium">Work Mode</p>
                <p className="text-sm font-semibold text-foreground">{getSelectedWorkMode()}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </motion.button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              className="bg-card border border-border rounded-[20px] shadow-xl p-3 z-50 animate-in fade-in-0 zoom-in-95 w-56"
              sideOffset={8}
            >
              <div className="space-y-1">
                {workModeOptions.map((opt) => (
                  <motion.button
                    key={opt.id}
                    onClick={() => {
                      onFilterChange("workMode", opt.id);
                      setIsWorkModeOpen(false);
                    }}
                    whileHover={{ x: 4 }}
                    className={`w-full text-left px-4 py-2.5 rounded-lg transition-all ${
                      workMode === opt.id
                        ? "bg-gradient-to-r from-[#6366F1]/10 to-[#8B5CF6]/10 text-[#6366F1] font-medium"
                        : "text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {opt.label}
                  </motion.button>
                ))}
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </div>
  );
}