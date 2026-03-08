import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export const PageHeader = ({ title, subtitle, actions }: PageHeaderProps) => {
  return (
    <div className="pt-28 pb-12">
      <div className="flex items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-xs font-mono text-primary tracking-[0.3em] uppercase mb-3 block">
            ~/portfolio
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-muted-foreground mt-3 max-w-xl text-lg">
              {subtitle}
            </p>
          )}
          <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent rounded-full mt-4" />
        </motion.div>
        
        {actions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {actions}
          </motion.div>
        )}
      </div>
    </div>
  );
};
