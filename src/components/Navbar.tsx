
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Navbar = () => {
  return (
    <header className="bg-gray-100 border-b shadow-sm py-2 px-4 md:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center md:hidden">
          <h1 className="text-xl font-bold text-hotel-primary">HotelInsight</h1>
        </div>
        
        <div className="hidden md:flex items-center space-x-4 md:space-x-6">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Rechercher..." className="pl-8" />
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          <Link to="/tarifs" className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-200">Tarifs</Link>
          <Link to="/disponibilites" className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-200">Disponibilités</Link>
          <Link to="/staff" className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-200">Staff</Link>
          <Link to="/concurrence" className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-200">Concurrence</Link>
          <Link to="/alertes" className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-200">Alertes</Link>
        </nav>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 bg-hotel-alert text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
          </Button>
          
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback className="bg-hotel-primary text-white">RM</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
