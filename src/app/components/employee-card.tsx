import { useState } from "react";
import { motion } from "motion/react";
import { ChevronDown, CheckCircle, XCircle } from "lucide-react";

export interface MissingEntry {
  id: string;
  workMode: string;
  project: string;
  task: string;
  hours: number;
  units: number;
  reason: string;
  dueDate: string;
  status: "pending" | "approved" | "rejected";
}

export interface Employee {
  id: string;
  name: string;
  entries: MissingEntry[];
}

interface EmployeeCardProps {
  employee: Employee;
  onApprove: (employeeId: string, entryId: string) => void;
  onReject: (employeeId: string, entryId: string) => void;
  onApproveAll: (employeeId: string) => void;
}

export function EmployeeCard({ employee, onApprove, onReject, onApproveAll }: EmployeeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const pendingCount = employee.entries.filter((e) => e.status === "pending").length;
  const approvedCount = employee.entries.filter((e) => e.status === "approved").length;
  const rejectedCount = employee.entries.filter((e) => e.status === "rejected").length;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-[20px] border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Card Header */}
      <div
        className="p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-lg">
              <span className="text-white font-semibold">{getInitials(employee.name)}</span>
            </div>

            {/* Info */}
            <div>
              <h3 className="font-semibold text-foreground">{employee.name}</h3>
              <p className="text-sm text-muted-foreground">
                {employee.entries.length} missing {employee.entries.length === 1 ? "entry" : "entries"}
              </p>
            </div>
          </div>

          {/* Badges & Actions */}
          <div className="flex items-center gap-3">
            {/* Status Badges */}
            <div className="flex items-center gap-2">
              {pendingCount > 0 && (
                <span className="px-3 py-1 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] text-xs font-medium">
                  {pendingCount} Pending
                </span>
              )}
              {approvedCount > 0 && (
                <span className="px-3 py-1 rounded-full bg-[#22C55E]/10 text-[#22C55E] text-xs font-medium">
                  {approvedCount} Approved
                </span>
              )}
              {rejectedCount > 0 && (
                <span className="px-3 py-1 rounded-full bg-[#EF4444]/10 text-[#EF4444] text-xs font-medium">
                  {rejectedCount} Rejected
                </span>
              )}
            </div>

            {/* Approve All Button */}
            {pendingCount > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onApproveAll(employee.id);
                }}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-sm font-medium shadow-lg hover:shadow-xl transition-shadow"
              >
                Approve All Pending
              </button>
            )}

            {/* Expand Icon */}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="px-6 pb-6">
          <div className="bg-muted/30 rounded-2xl overflow-hidden border border-border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                      Work Mode
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                      Project
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                      Task
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                      Hours
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                      Units
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                      Reason
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                      Due Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {employee.entries.map((entry) => (
                    <tr
                      key={entry.id}
                      className="border-t border-border hover:bg-[#6366F1]/5 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-foreground">{entry.workMode}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{entry.project}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{entry.task}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{entry.hours}h</td>
                      <td className="px-4 py-3 text-sm text-foreground">{entry.units}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground max-w-xs truncate">
                        {entry.reason}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">{entry.dueDate}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
                            entry.status === "pending"
                              ? "bg-[#F59E0B]/10 text-[#F59E0B]"
                              : entry.status === "approved"
                              ? "bg-[#22C55E]/10 text-[#22C55E]"
                              : "bg-[#EF4444]/10 text-[#EF4444]"
                          }`}
                        >
                          {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {entry.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => onApprove(employee.id, entry.id)}
                              className="p-2 rounded-full bg-[#22C55E]/10 hover:bg-[#22C55E]/20 transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4 text-[#22C55E]" />
                            </button>
                            <button
                              onClick={() => onReject(employee.id, entry.id)}
                              className="p-2 rounded-full bg-[#EF4444]/10 hover:bg-[#EF4444]/20 transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4 text-[#EF4444]" />
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
        </div>
      )}
    </motion.div>
  );
}