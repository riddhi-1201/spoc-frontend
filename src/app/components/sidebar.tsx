import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Home,
  ClipboardCheck,
  FileQuestion,
  FolderPlus,
  Clock,
  ChevronDown,
} from "lucide-react";

interface SidebarProps {
  activePage: string;
  onPageChange: (pageId: string) => void;
}

export function Sidebar({ activePage, onPageChange }: SidebarProps) {
  const [isMissingEntriesOpen, setIsMissingEntriesOpen] = useState(false);

  const menuItems = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      hasSubmenu: false,
    },
    {
      id: "approve-worklogs",
      label: "Approve Worklogs",
      icon: ClipboardCheck,
      hasSubmenu: false,
    },
    {
      id: "missing-entries",
      label: "Missing Entries",
      icon: FileQuestion,
      hasSubmenu: true,
      submenu: [
        { id: "request-missing-entries", label: "Request Missing Entries" },
        { id: "approve-missing-entries", label: "Approve Missing Entries" },
      ],
    },
    {
      id: "add-project",
      label: "Add Project",
      icon: FolderPlus,
      hasSubmenu: false,
    },
    {
      id: "mark-extra-shift",
      label: "Mark Extra Shift",
      icon: Clock,
      hasSubmenu: false,
    },
  ];

  const handleMenuClick = (itemId: string) => {
    const item = menuItems.find((i) => i.id === itemId);
    if (item?.hasSubmenu) {
      setIsMissingEntriesOpen(!isMissingEntriesOpen);
    } else {
      onPageChange(itemId);
      setIsMissingEntriesOpen(false);
    }
  };

  const handleSubmenuClick = (submenuId: string) => {
    onPageChange(submenuId);
  };

  return (
    <div className="w-64 h-full bg-card border-r border-border flex flex-col shadow-sm">
      {/* Logo Section */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <div>
            <h1 className="font-bold text-xl text-foreground dark:text-white dark:font-extrabold">Menu</h1>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id || 
            (item.hasSubmenu && item.submenu?.some(sub => sub.id === activePage));

          return (
            <div key={item.id}>
              <motion.button
                onClick={() => handleMenuClick(item.id)}
                whileHover={{ x: 6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-[#6366F1]/15 to-[#8B5CF6]/15 text-[#6366F1] dark:text-[#A78BFA] shadow-md border border-[#6366F1]/20 dark:border-[#8B5CF6]/30"
                    : "text-slate-700 dark:text-slate-200 hover:bg-gradient-to-r hover:from-muted/50 hover:to-muted/30 dark:hover:from-slate-700/50 dark:hover:to-slate-700/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'dark:drop-shadow-[0_0_8px_rgba(167,139,250,0.5)]' : ''}`} />
                  <span className={`text-sm ${isActive ? 'font-bold dark:font-extrabold' : 'font-semibold dark:font-bold'}`}>{item.label}</span>
                </div>
                {item.hasSubmenu && (
                  <motion.div
                    animate={{ rotate: isMissingEntriesOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                )}
              </motion.button>

              {/* Submenu */}
              {item.hasSubmenu && (
                <AnimatePresence>
                  {isMissingEntriesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="ml-6 mt-2 space-y-1 border-l-2 border-[#6366F1]/30 dark:border-[#8B5CF6]/40 pl-4">
                        {item.submenu?.map((subItem) => (
                          <motion.button
                            key={subItem.id}
                            onClick={() => handleSubmenuClick(subItem.id)}
                            whileHover={{ x: 4, scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                              activePage === subItem.id
                                ? "bg-gradient-to-r from-[#6366F1]/15 to-[#8B5CF6]/15 text-[#6366F1] dark:text-[#A78BFA] font-bold dark:font-extrabold border border-[#6366F1]/20 dark:border-[#8B5CF6]/30"
                                : "text-slate-700 dark:text-slate-300 hover:bg-muted/40 dark:hover:bg-slate-700/40 font-medium dark:font-semibold"
                            }`}
                          >
                            {subItem.label}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          © 2026 SPOC Dashboard
        </div>
      </div>
    </div>
  );
}