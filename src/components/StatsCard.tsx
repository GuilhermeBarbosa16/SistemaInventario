
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className = ""
}) => {
  return (
    <Card className={`hover-lift ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-wood-800">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
            {trend && (
              <div className={`flex items-center mt-2 text-xs ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                <span>{trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%</span>
                <span className="text-muted-foreground ml-1">vs. mês anterior</span>
              </div>
            )}
          </div>
          <div className="p-3 bg-wood-100 rounded-lg">
            <Icon className="h-6 w-6 text-wood-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
