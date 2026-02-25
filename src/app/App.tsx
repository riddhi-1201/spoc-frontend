import { useState, useEffect, useMemo } from "react";
import { Navbar } from "./components/navbar";
import { Sidebar } from "./components/sidebar";
import { FilterBar } from "./components/filter-bar";
import { AnalyticsCards } from "./components/analytics-cards";
import type { Employee, MissingEntry } from "./components/employee-card";
import { EmployeeCard } from "./components/employee-card";
import { ActivitySection } from "./components/activity-section";
import { MissingEntryPage } from "./components/missing-entry-page";
import { SPOCDashboard } from "./components/spoc-dashboard";
import { HomePage } from "./components/home-page";
import { motion } from "motion/react";

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [activePage, setActivePage] = useState("home");

  // Filter states
  const [employeesFilter, setEmployeesFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [workModeFilter, setWorkModeFilter] = useState("all");

  // Mock data
  const [employeesData, setEmployeesData] = useState<
    Record<string, { date: string; employees: Employee[] }>
  >({
    "2026-02-24": {
      date: "2026-02-24",
      employees: [
        {
          id: "john",
          name: "John Smith",
          entries: [
            {
              id: "e1",
              workMode: "Office",
              project: "Project Alpha",
              task: "Design Review",
              hours: 8,
              units: 1,
              reason: "Forgot to submit after meeting",
              dueDate: "Feb 23, 2026",
              status: "pending",
            },
            {
              id: "e2",
              workMode: "WFH",
              project: "Project Beta",
              task: "Code Implementation",
              hours: 6,
              units: 0.75,
              reason: "System was down",
              dueDate: "Feb 22, 2026",
              status: "pending",
            },
          ],
        },
        {
          id: "sarah",
          name: "Sarah Johnson",
          entries: [
            {
              id: "e3",
              workMode: "Hybrid",
              project: "Project Gamma",
              task: "Client Meeting",
              hours: 4,
              units: 0.5,
              reason: "Late submission due to travel",
              dueDate: "Feb 23, 2026",
              status: "pending",
            },
            {
              id: "e4",
              workMode: "Office",
              project: "Project Delta",
              task: "Testing",
              hours: 7,
              units: 0.875,
              reason: "Overlooked during weekend",
              dueDate: "Feb 21, 2026",
              status: "approved",
            },
          ],
        },
      ],
    },
    "2026-02-23": {
      date: "2026-02-23",
      employees: [
        {
          id: "mike",
          name: "Mike Wilson",
          entries: [
            {
              id: "e5",
              workMode: "Office",
              project: "Project Epsilon",
              task: "Documentation",
              hours: 5,
              units: 0.625,
              reason: "Missed deadline",
              dueDate: "Feb 20, 2026",
              status: "pending",
            },
            {
              id: "e6",
              workMode: "WFH",
              project: "Project Zeta",
              task: "Code Review",
              hours: 3,
              units: 0.375,
              reason: "Technical issues",
              dueDate: "Feb 19, 2026",
              status: "rejected",
            },
          ],
        },
        {
          id: "emma",
          name: "Emma Davis",
          entries: [
            {
              id: "e7",
              workMode: "Hybrid",
              project: "Project Eta",
              task: "Planning",
              hours: 8,
              units: 1,
              reason: "Away on business trip",
              dueDate: "Feb 22, 2026",
              status: "pending",
            },
            {
              id: "e8",
              workMode: "Office",
              project: "Project Theta",
              task: "Development",
              hours: 6,
              units: 0.75,
              reason: "System maintenance",
              dueDate: "Feb 21, 2026",
              status: "approved",
            },
          ],
        },
      ],
    },
  });

  // Theme toggle
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // Filter handlers
  const handleFilterChange = (filter: string, value: string) => {
    switch (filter) {
      case "employees":
        setEmployeesFilter(value);
        break;
      case "status":
        setStatusFilter(value);
        break;
      case "workMode":
        setWorkModeFilter(value);
        break;
    }
  };

  // Action handlers
  const handleApprove = (employeeId: string, entryId: string) => {
    setEmployeesData((prev) => {
      const newData = { ...prev };
      Object.keys(newData).forEach((date) => {
        const empIndex = newData[date].employees.findIndex((e) => e.id === employeeId);
        if (empIndex !== -1) {
          const entryIndex = newData[date].employees[empIndex].entries.findIndex(
            (e) => e.id === entryId
          );
          if (entryIndex !== -1) {
            newData[date].employees[empIndex].entries[entryIndex].status = "approved";
          }
        }
      });
      return newData;
    });
  };

  const handleReject = (employeeId: string, entryId: string) => {
    setEmployeesData((prev) => {
      const newData = { ...prev };
      Object.keys(newData).forEach((date) => {
        const empIndex = newData[date].employees.findIndex((e) => e.id === employeeId);
        if (empIndex !== -1) {
          const entryIndex = newData[date].employees[empIndex].entries.findIndex(
            (e) => e.id === entryId
          );
          if (entryIndex !== -1) {
            newData[date].employees[empIndex].entries[entryIndex].status = "rejected";
          }
        }
      });
      return newData;
    });
  };

  const handleApproveAll = (employeeId: string) => {
    setEmployeesData((prev) => {
      const newData = { ...prev };
      Object.keys(newData).forEach((date) => {
        const empIndex = newData[date].employees.findIndex((e) => e.id === employeeId);
        if (empIndex !== -1) {
          newData[date].employees[empIndex].entries = newData[date].employees[
            empIndex
          ].entries.map((entry) =>
            entry.status === "pending" ? { ...entry, status: "approved" as const } : entry
          );
        }
      });
      return newData;
    });
  };

  // Calculate analytics with filters
  const analytics = useMemo(() => {
    let allEntries: MissingEntry[] = [];
    let employeeMap: Record<string, number> = {};

    Object.values(employeesData).forEach((dateGroup) => {
      dateGroup.employees.forEach((emp) => {
        // Apply employee filter
        if (employeesFilter !== "all" && emp.id !== employeesFilter) return;

        emp.entries.forEach((entry) => {
          // Apply status filter
          if (statusFilter !== "all" && entry.status !== statusFilter) return;

          // Apply work mode filter
          if (
            workModeFilter !== "all" &&
            entry.workMode.toLowerCase().replace(" ", "") !==
              workModeFilter.toLowerCase().replace(" ", "")
          ) {
            return;
          }

          allEntries.push(entry);
          employeeMap[emp.name] = (employeeMap[emp.name] || 0) + 1;
        });
      });
    });

    const totalRequests = allEntries.length;
    const pendingRequests = allEntries.filter((e) => e.status === "pending").length;
    const approvedToday = allEntries.filter((e) => e.status === "approved").length;
    const rejectedToday = allEntries.filter((e) => e.status === "rejected").length;

    const employeeBreakdown = Object.entries(employeeMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Activity breakdown
    const activityBreakdown: { name: string; approved: number; rejected: number }[] = [];
    Object.values(employeesData).forEach((dateGroup) => {
      dateGroup.employees.forEach((emp) => {
        if (employeesFilter !== "all" && emp.id !== employeesFilter) return;

        const approved = emp.entries.filter((e) => e.status === "approved").length;
        const rejected = emp.entries.filter((e) => e.status === "rejected").length;

        if (approved > 0 || rejected > 0) {
          const existing = activityBreakdown.find((a) => a.name === emp.name);
          if (existing) {
            existing.approved += approved;
            existing.rejected += rejected;
          } else {
            activityBreakdown.push({ name: emp.name, approved, rejected });
          }
        }
      });
    });

    return {
      totalRequests,
      pendingRequests,
      approvedToday,
      rejectedToday,
      employeeBreakdown,
      activityBreakdown,
    };
  }, [employeesData, employeesFilter, statusFilter, workModeFilter]);

  // Filter employees data for display
  const filteredData = useMemo(() => {
    const filtered: typeof employeesData = {};

    Object.entries(employeesData).forEach(([date, dateGroup]) => {
      const filteredEmployees: Employee[] = [];

      dateGroup.employees.forEach((emp) => {
        // Apply employee filter
        if (employeesFilter !== "all" && emp.id !== employeesFilter) return;

        const filteredEntries = emp.entries.filter((entry) => {
          // Apply status filter
          if (statusFilter !== "all" && entry.status !== statusFilter) return false;

          // Apply work mode filter
          if (
            workModeFilter !== "all" &&
            entry.workMode.toLowerCase().replace(" ", "") !==
              workModeFilter.toLowerCase().replace(" ", "")
          ) {
            return false;
          }

          return true;
        });

        if (filteredEntries.length > 0) {
          filteredEmployees.push({ ...emp, entries: filteredEntries });
        }
      });

      if (filteredEmployees.length > 0) {
        filtered[date] = { date, employees: filteredEmployees };
      }
    });

    return filtered;
  }, [employeesData, employeesFilter, statusFilter, workModeFilter]);

  return (
    <div
      className={`min-h-screen ${
        isDark
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          : "bg-gradient-to-br from-[#F8FAFC] to-[#EEF2FF]"
      } transition-colors duration-500`}
    >
      <div className="flex flex-col h-screen">
        {/* Navbar */}
        <Navbar isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} />

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <Sidebar activePage={activePage} onPageChange={setActivePage} />

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-[1600px] mx-auto p-6 space-y-6">
              {activePage === "home" ? (
                <HomePage isDark={isDark} />
              ) : activePage === "request-missing-entries" ? (
                <MissingEntryPage isDark={isDark} />
              ) : activePage === "approve-worklogs" ? (
                <SPOCDashboard isDark={isDark} />
              ) : (
                <>
                  {/* Filter Bar */}
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <FilterBar
                      employees={employeesFilter}
                      status={statusFilter}
                      workMode={workModeFilter}
                      onFilterChange={handleFilterChange}
                    />
                  </motion.div>

                  {/* Analytics Cards */}
                  <AnalyticsCards
                    totalRequests={analytics.totalRequests}
                    pendingRequests={analytics.pendingRequests}
                    approvedToday={analytics.approvedToday}
                    rejectedToday={analytics.rejectedToday}
                    employeeBreakdown={analytics.employeeBreakdown}
                  />

                  {/* Employee Cards by Date */}
                  <div className="space-y-6">
                    {Object.entries(filteredData)
                      .sort((a, b) => b[0].localeCompare(a[0]))
                      .map(([date, dateGroup]) => (
                        <div key={date} className="space-y-4">
                          {/* Date Header */}
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3"
                          >
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                            <span className="text-sm font-medium text-muted-foreground px-4 py-1 bg-muted/50 rounded-full">
                              {new Date(date).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                          </motion.div>

                          {/* Employee Cards */}
                          <div className="space-y-4">
                            {dateGroup.employees.map((employee) => (
                              <EmployeeCard
                                key={employee.id}
                                employee={employee}
                                onApprove={handleApprove}
                                onReject={handleReject}
                                onApproveAll={handleApproveAll}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Activity Section */}
                  <ActivitySection
                    approvedToday={analytics.approvedToday}
                    rejectedToday={analytics.rejectedToday}
                    employeeBreakdown={analytics.activityBreakdown}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
