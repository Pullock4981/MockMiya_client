'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Users, FileText, Eye, TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  change: string;
  trend: 'up' | 'down';
  icon: 'Users' | 'FileText' | 'Eye' | 'TrendingUp';
  color: string;
}

export default function StatCard({ title, value, change, trend, icon, color }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          <div className="flex items-center gap-1 mt-2">
            {trend === 'up' ? (
              <ArrowUpRight className="w-4 h-4 text-green-500" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
              {change}
            </span>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon === 'Users' && <Users className="w-6 h-6 text-white" />}
          {icon === 'FileText' && <FileText className="w-6 h-6 text-white" />}
          {icon === 'Eye' && <Eye className="w-6 h-6 text-white" />}
          {icon === 'TrendingUp' && <TrendingUp className="w-6 h-6 text-white" />}
        </div>
      </div>
    </motion.div>
  );
}
