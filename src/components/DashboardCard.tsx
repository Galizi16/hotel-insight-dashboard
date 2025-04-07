
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
        "overflow-hidden transition-all duration-300 hover:shadow-xl neo-border", 
        "transform hover:-translate-y-1 hover:scale-[1.01] relative",
        "bg-gradient-to-br from-card to-muted/30 backdrop-blur-sm",
        onClick ? "cursor-pointer" : "", 
        className
      )}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-grid-lines bg-grid opacity-10"></div>
      
      <CardHeader className="relative z-10 cyber-lines text-white p-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          {icon && <span className="text-cyan-400">{icon}</span>}
          <span className="text-gradient">{title}</span>
        </CardTitle>
        
        <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-bl-full"></div>
      </CardHeader>
      
      <CardContent className="relative z-10 p-5 backdrop-blur-sm">
        {children}
      </CardContent>
      
      <div className="absolute bottom-0 right-0 w-20 h-20 bg-cyan-500/5 rounded-tl-full"></div>
    </Card>
  );
};

export default DashboardCard;
