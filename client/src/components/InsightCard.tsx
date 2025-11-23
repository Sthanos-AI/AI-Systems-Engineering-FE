import { FC } from 'react';
import { DollarSign } from 'lucide-react';
import { Card } from './ui/Card';

// Using DollarSign as a generic type representative for Lucide icons
interface InsightCardProps {
  title: string;
  value: string | number;
  icon: typeof DollarSign; 
  colorClass: string;
  details: string;
}

export const InsightCard: FC<InsightCardProps> = ({ title, value, icon: Icon, colorClass, details }) => (
  <Card className="p-5 transition-transform duration-300 hover:scale-[1.01] cursor-default">
    <div className="flex items-center justify-between mb-3">
      <div className={`p-3 rounded-lg ${colorClass} bg-opacity-15`}>
        <Icon className={`w-6 h-6 white-font ${colorClass.replace('bg-', 'text-')}`} />
      </div>
    </div>
    <div className="text-slate-500 text-xs font-semibold uppercase tracking-widest">{title}</div>
    <div className="text-3xl font-extrabold text-slate-900 mt-1">{value}</div>
    <p className="text-xs text-slate-400 mt-2">{details}</p>
  </Card>
);