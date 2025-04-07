
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Calendar, 
  Users, 
  PieChart, 
  BellRing,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Hotel
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardCard from '@/components/DashboardCard';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const Dashboard = () => {
  const [occupationRate] = useState(72);
  const [averageRate] = useState(129);
  const [staffAvailability] = useState(85);
  const [competitorPriceDiff] = useState(-12);
  const [alertsCount] = useState(3);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
        <p className="text-gray-600">Bienvenue dans l'interface de gestion de l'hôtel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <Link to="/disponibilites" className="block">
          <DashboardCard 
            title="Disponibilités" 
            icon={<Calendar className="h-5 w-5" />}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Taux d'occupation</span>
                <span className="text-2xl font-bold text-hotel-primary">{occupationRate}%</span>
              </div>
              <Progress value={occupationRate} className="h-2" />
              <p className="text-sm text-gray-500">
                {45 - Math.floor(45 * occupationRate / 100)} chambres disponibles sur 45
              </p>
              <div className="flex justify-end">
                <Button variant="link" size="sm" className="flex items-center gap-1 text-hotel-primary">
                  Voir les détails <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DashboardCard>
        </Link>

        <Link to="/tarifs" className="block">
          <DashboardCard 
            title="Tarifs" 
            icon={<BarChart3 className="h-5 w-5" />}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Tarif moyen</span>
                <span className="text-2xl font-bold text-hotel-primary">{averageRate}€</span>
              </div>
              <div className="text-sm text-gray-500 space-y-1">
                <div className="flex justify-between">
                  <span>Standard</span>
                  <span className="font-medium">{averageRate - 30}€</span>
                </div>
                <div className="flex justify-between">
                  <span>Supérieure</span>
                  <span className="font-medium">{averageRate}€</span>
                </div>
                <div className="flex justify-between">
                  <span>Suite</span>
                  <span className="font-medium">{averageRate + 70}€</span>
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="link" size="sm" className="flex items-center gap-1 text-hotel-primary">
                  Voir les détails <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DashboardCard>
        </Link>

        <Link to="/staff" className="block">
          <DashboardCard 
            title="Staff" 
            icon={<Users className="h-5 w-5" />}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Disponibilité du personnel</span>
                <span className="text-2xl font-bold text-hotel-primary">{staffAvailability}%</span>
              </div>
              <Progress value={staffAvailability} className="h-2" />
              <div className="text-sm text-gray-500 space-y-1">
                <div className="flex justify-between">
                  <span>Réception</span>
                  <span className="font-medium">3/3</span>
                </div>
                <div className="flex justify-between">
                  <span>Ménage</span>
                  <span className="font-medium">4/5</span>
                </div>
                <div className="flex justify-between">
                  <span>Maintenance</span>
                  <span className="font-medium">1/2</span>
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="link" size="sm" className="flex items-center gap-1 text-hotel-primary">
                  Voir les détails <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DashboardCard>
        </Link>

        <Link to="/concurrence" className="block">
          <DashboardCard 
            title="Concurrence" 
            icon={<PieChart className="h-5 w-5" />}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Différence de prix</span>
                <div className="flex items-center gap-1">
                  {competitorPriceDiff < 0 ? (
                    <TrendingDown className="h-5 w-5 text-hotel-success" />
                  ) : (
                    <TrendingUp className="h-5 w-5 text-hotel-alert" />
                  )}
                  <span className="text-2xl font-bold text-hotel-primary">
                    {competitorPriceDiff}%
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-500 space-y-1">
                <p>Vos tarifs sont en moyenne {Math.abs(competitorPriceDiff)}% {competitorPriceDiff < 0 ? 'inférieurs' : 'supérieurs'} à la concurrence.</p>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <div className="flex items-center gap-2">
                  <Hotel className="h-4 w-4 text-hotel-secondary" />
                  <span>Hôtel voisin 1</span>
                </div>
                <span className="font-medium">140€</span>
              </div>
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Hotel className="h-4 w-4 text-hotel-accent" />
                  <span>Hôtel voisin 2</span>
                </div>
                <span className="font-medium">155€</span>
              </div>
              <div className="flex justify-end">
                <Button variant="link" size="sm" className="flex items-center gap-1 text-hotel-primary">
                  Voir les détails <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DashboardCard>
        </Link>

        <Link to="/alertes" className="block">
          <DashboardCard 
            title="Alertes & Rapports" 
            icon={<BellRing className="h-5 w-5" />}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Alertes actives</span>
                <span className="text-2xl font-bold text-hotel-primary">{alertsCount}</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 rounded-md bg-red-50">
                  <div className="h-2 w-2 rounded-full bg-hotel-alert"></div>
                  <span className="text-sm text-gray-700">Rupture de stock minibar</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-md bg-amber-50">
                  <div className="h-2 w-2 rounded-full bg-hotel-warning"></div>
                  <span className="text-sm text-gray-700">Personnel réduit demain</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-md bg-blue-50">
                  <div className="h-2 w-2 rounded-full bg-hotel-info"></div>
                  <span className="text-sm text-gray-700">Tarifs concurrents modifiés</span>
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="link" size="sm" className="flex items-center gap-1 text-hotel-primary">
                  Voir toutes les alertes <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DashboardCard>
        </Link>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
