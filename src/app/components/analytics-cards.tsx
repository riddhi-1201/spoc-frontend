import { motion } from "motion/react";
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useEffect, useState } from "react";

interface AnalyticsCardsProps {
  totalRequests: number;
  pendingRequests: number;
  approvedToday: number;
  rejectedToday: number;
  employeeBreakdown: { name: string; count: number }[];
}

export function AnalyticsCards({
  totalRequests,
  pendingRequests,
  approvedToday,
  rejectedToday,
  employeeBreakdown,
}: AnalyticsCardsProps) {
  const cards = [
    {
      title: "Total Missing Requests",
      value: totalRequests,
      icon: FileText,
      color: "from-[#6366F1] to-[#8B5CF6]",
      bgColor: "from-[#6366F1]/10 to-[#8B5CF6]/10",
    },
    {
      title: "Pending Requests",
      value: pendingRequests,
      icon: Clock,
      color: "from-[#F59E0B] to-[#F97316]",
      bgColor: "from-[#F59E0B]/10 to-[#F97316]/10",
    },
    {
      title: "Approved Today",
      value: approvedToday,
      icon: CheckCircle,
      color: "from-[#22C55E] to-[#16A34A]",
      bgColor: "from-[#22C55E]/10 to-[#16A34A]/10",
    },
    {
      title: "Rejected Today",
      value: rejectedToday,
      icon: XCircle,
      color: "from-[#EF4444] to-[#DC2626]",
      bgColor: "from-[#EF4444]/10 to-[#DC2626]/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Tooltip.Provider key={card.title} delayDuration={200}>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{
                  y: -8,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                }}
                className="bg-card rounded-[20px] p-6 border border-border shadow-sm cursor-pointer group relative overflow-hidden"
              >
                {/* Gradient top border */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.color}`}
                />

                {/* Background gradient on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                <div className="relative z-10 flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}
                  >
                    <card.icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">{card.title}</p>
                    <AnimatedCounter value={card.value} />
                  </div>
                </div>
              </motion.div>
            </Tooltip.Trigger>

            <Tooltip.Portal>
              <Tooltip.Content
                className="bg-card border border-border rounded-xl shadow-xl p-4 max-w-xs z-50 animate-in fade-in-0 zoom-in-95"
                sideOffset={5}
              >
                <div className="space-y-2">
                  <p className="font-medium text-sm text-foreground">{card.title} Breakdown</p>
                  {employeeBreakdown.length > 0 ? (
                    <div className="space-y-1">
                      {employeeBreakdown.slice(0, 5).map((emp) => (
                        <div
                          key={emp.name}
                          className="flex justify-between text-xs text-muted-foreground"
                        >
                          <span>{emp.name}</span>
                          <span className="font-medium">{emp.count}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No data available</p>
                  )}
                </div>
                <Tooltip.Arrow className="fill-border" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      ))}
    </div>
  );
}

function AnimatedCounter({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return <p className="text-3xl font-semibold text-foreground">{displayValue}</p>;
}
