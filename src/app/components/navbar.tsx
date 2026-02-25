import { Moon, Sun, Bell, User } from "lucide-react";
import { motion } from "motion/react";

interface NavbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export function Navbar({ isDark, onToggleTheme }: NavbarProps) {
  return (
    <div className="h-16 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center">
            <span className="text-white font-semibold">SP</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">SPOC Dashboard</h1>
            <p className="text-xs text-muted-foreground">Approve Missing Entries</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors relative"
          >
            <Bell className="w-5 h-5 text-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full"></span>
          </motion.button>

          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleTheme}
            className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-foreground" />
            ) : (
              <Moon className="w-5 h-5 text-foreground" />
            )}
          </motion.button>

          {/* User Profile */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-foreground hidden sm:block">Admin</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
