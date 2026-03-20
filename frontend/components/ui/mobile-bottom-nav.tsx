'use client';

import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  CreditCard, 
  Package, 
  User,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

type Section = 'portfolio' | 'purchase' | 'payments' | 'deliveries' | 'profile' | 'analytics' | 'charts' | 'alerts' | 'security' | 'transactions' | 'support';

interface MobileBottomNavProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
}

interface NavItem {
  id: Section;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { id: 'portfolio', label: 'Portfolio', icon: LayoutDashboard },
  { id: 'purchase', label: 'Buy', icon: ShoppingCart },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'deliveries', label: 'Deliveries', icon: Package },
  { id: 'profile', label: 'Profile', icon: User },
];

export function MobileBottomNav({ activeSection, onSectionChange }: MobileBottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/98 backdrop-blur-xl border-t-2 border-[#92422B]/30 shadow-[0_-8px_32px_rgba(104,20,18,0.15)] mobile-bottom-safe">
      <div className="flex items-center justify-around h-16 px-1 sm:px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              whileTap={{ scale: 0.85 }}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full relative touch-manipulation min-w-0"
            >
              <motion.div
                className={`relative p-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-br from-[#681412] to-[#92422B] shadow-lg shadow-[#681412]/30'
                    : 'bg-transparent'
                }`}
                animate={{
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Icon 
                  className={`h-5 w-5 transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-[#E79A66]'
                  }`}
                />
                {isActive && (
                  <motion.div
                    className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-white border-2 border-[#681412]"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  />
                )}
              </motion.div>
              <span
                className={`text-[10px] font-semibold transition-colors duration-200 leading-tight ${
                  isActive ? 'text-[#681412]' : 'text-[#E79A66]'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-10 rounded-t-full bg-gradient-to-r from-[#681412] to-[#92422B]"
                  layoutId="activeIndicator"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}

