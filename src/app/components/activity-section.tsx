import { motion } from "motion/react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp, CheckCircle, XCircle } from "lucide-react";

interface ActivitySectionProps {
  approvedToday: number;
  rejectedToday: number;
  employeeBreakdown: { name: string; approved: number; rejected: number }[];
}

export function ActivitySection({
  approvedToday,
  rejectedToday,
  employeeBreakdown,
}: ActivitySectionProps) {
  const chartData = [
    { name: "Approved", value: approvedToday, color: "#22C55E" },
    { name: "Rejected", value: rejectedToday, color: "#EF4444" },
  ];

  const total = approvedToday + rejectedToday;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-card rounded-[20px] p-6 border border-border shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Today's SPOC Missing Entry Actions</h3>
          <p className="text-sm text-muted-foreground">Real-time approval activity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart Section */}
        <div className="flex flex-col items-center justify-center">
          {total > 0 ? (
            <>
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
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                      padding: "8px 12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#22C55E]" />
                  <span className="text-sm text-muted-foreground">
                    Approved ({approvedToday})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                  <span className="text-sm text-muted-foreground">
                    Rejected ({rejectedToday})
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No actions taken today</p>
            </div>
          )}
        </div>

        {/* Breakdown Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">
            Breakdown by Employee
          </h4>

          {employeeBreakdown.length > 0 ? (
            <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
              {employeeBreakdown.map((emp, index) => (
                <motion.div
                  key={emp.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ x: 4 }}
                  className="bg-muted/30 rounded-xl p-3 border border-border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{emp.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {emp.approved + emp.rejected} total
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#22C55E]" />
                      <span className="text-sm text-[#22C55E] font-medium">{emp.approved}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-[#EF4444]" />
                      <span className="text-sm text-[#EF4444] font-medium">{emp.rejected}</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          (emp.approved / (emp.approved + emp.rejected || 1)) * 100
                        }%`,
                      }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className="h-full bg-gradient-to-r from-[#22C55E] to-[#16A34A]"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">No employee actions yet</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
