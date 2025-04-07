
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
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-lg card-gradient border border-white/5", 
        "transform hover:-translate-y-1 relative",
        onClick ? "cursor-pointer" : "", 
        className
      )}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-grid-lines bg-grid opacity-10"></div>
      
      <CardHeader className="relative z-10 bg-gradient-to-r from-hotel-primary/90 to-hotel-primary/70 text-white p-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          {title}
        </CardTitle>
        
        <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-bl-full"></div>
      </CardHeader>
      
      <CardContent className="relative z-10 p-5 backdrop-blur-sm">
        {children}
      </CardContent>
      
      <div className="absolute bottom-0 right-0 w-20 h-20 bg-blue-500/5 rounded-tl-full"></div>
    </Card>
  );
};

export default DashboardCard;
