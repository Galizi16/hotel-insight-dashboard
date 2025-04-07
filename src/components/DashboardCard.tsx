
import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const DashboardCard = ({ title, icon, children, className, onClick }: DashboardCardProps) => {
  return (
    <Card 
      className={cn("overflow-hidden transition-all hover:shadow-md", 
        onClick ? "cursor-pointer" : "", 
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="bg-gradient-to-r from-hotel-primary to-hotel-primary/80 text-white p-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        {children}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
