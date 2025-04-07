import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { 
  BellRing, 
  UserX, 
  Search, 
  AlertTriangle, 
  FileText,
  ArrowUpRight,
  Calendar as CalendarIcon,
  Download
} from 'lucide-react';
import DashboardCard from '@/components/DashboardCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PopoverContent, PopoverTrigger, Popover } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Alerte {
  id: string;
  date: string;
  module: string;
  type: string;
  niveau: string;
  message: string;
  lue: boolean;
}

const generateTestAlerts = (): Alerte[] => {
  return [
    {
      id: '1',
      date: '2025-04-07',
      module: 'Staff',
      type: 'Personnel',
      niveau: 'warning',
      message: 'Personnel réduit demain (2 réceptionnistes absents)',
      lue: false
    },
    {
      id: '2',
      date: '2025-04-07',
      module: 'Disponibilités',
      type: 'Occupation',
      niveau: 'success',
      message: 'Taux d\'occupation à 90% ce weekend',
      lue: false
    },
    {
      id: '3',
      date: '2025-04-06',
      module: 'Tarifs',
      type: 'Tarification',
      niveau: 'info',
      message: 'Tarifs weekends ajustés automatiquement (+10%)',
      lue: true
    },
    {
      id: '4',
      date: '2025-04-06',
      module: 'Concurrence',
      type: 'Benchmark',
      niveau: 'warning',
      message: 'Hôtel concurrent 1 a baissé ses prix de 15%',
      lue: false
    },
    {
      id: '5',
      date: '2025-04-05',
      module: 'Disponibilités',
      type: 'Capacité',
      niveau: 'error',
      message: 'Surréservation détectée pour le 20/04',
      lue: false
    },
    {
      id: '6',
      date: '2025-04-05',
      module: 'Staff',
      type: 'Personnel',
      niveau: 'info',
      message: 'Nouvelle rotation du personnel mise en place',
      lue: true
    },
    {
      id: '7',
      date: '2025-04-04',
      module: 'Tarifs',
      type: 'Tarification',
      niveau: 'success',
      message: 'Objectif de revenu atteint pour le mois précédent',
      lue: true
    }
  ];
};

const AlertesPage = () => {
  const [alertes] = useState<Alerte[]>(generateTestAlerts());
  const [filtreModule, setFiltreModule] = useState<string | null>(null);
  const [filtreNiveau, setFiltreNiveau] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date>(new Date(2025, 3, 1));
  const [endDate, setEndDate] = useState<Date>(new Date(2025, 3, 30));
  
  const filtrerAlertes = () => {
    return alertes.filter(alerte => {
      const matchModule = filtreModule ? alerte.module === filtreModule : true;
      const matchNiveau = filtreNiveau ? alerte.niveau === filtreNiveau : true;
      const alerteDate = new Date(alerte.date);
      const matchDate = alerteDate >= startDate && alerteDate <= endDate;
      
      return matchModule && matchNiveau && matchDate;
    });
  };
  
  const alertesFiltrees = filtrerAlertes();
  const alertesNonLues = alertes.filter(a => !a.lue).length;
  
  const alertesParModule: Record<string, number> = alertes.reduce((acc, alerte) => {
    acc[alerte.module] = (acc[alerte.module] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const alertesParNiveau: Record<string, number> = alertes.reduce((acc, alerte) => {
    acc[alerte.niveau] = (acc[alerte.niveau] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const marquerCommeLue = (id: string) => {
    const index = alertes.findIndex(a => a.id === id);
    if (index !== -1) {
      alertes[index].lue = true;
      toast.success("Alerte marquée comme lue");
    }
  };
  
  const marquerToutesCommeLues = () => {
    alertes.forEach(a => a.lue = true);
    toast.success("Toutes les alertes ont été marquées comme lues");
  };
  
  const exporterRapport = () => {
    toast.success("Génération du rapport PDF en cours...");
    setTimeout(() => {
      toast.success("Rapport PDF généré et prêt à être téléchargé");
    }, 1500);
  };
  
  const getNiveauBadge = (niveau: string) => {
    switch (niveau) {
      case 'error':
        return <Badge className="bg-red-500">Critique</Badge>;
      case 'warning':
        return <Badge className="bg-amber-500">Avertissement</Badge>;
      case 'success':
        return <Badge className="bg-green-500">Succès</Badge>;
      case 'info':
        return <Badge className="bg-blue-500">Information</Badge>;
      default:
        return <Badge className="bg-gray-500">Autre</Badge>;
    }
  };
  
  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'Tarifs':
        return '💰';
      case 'Disponibilités':
        return '🛏️';
      case 'Staff':
        return '👥';
      case 'Concurrence':
        return '📊';
      default:
        return '🔔';
    }
  };
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Alertes & Rapports</h1>
        <p className="text-gray-600">Centralisez et gérez toutes les alertes des différents modules</p>
      </div>
      
      <Tabs defaultValue="alerts">
        <TabsList className="mb-6">
          <TabsTrigger value="alerts">Alertes</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="alerts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DashboardCard
              title="Alertes non lues"
              icon={<BellRing className="h-5 w-5" />}
            >
              <div className="flex flex-col items-center justify-center py-4">
                <div className="text-4xl font-bold text-hotel-primary mb-2">{alertesNonLues}</div>
                <p className="text-gray-500 text-sm">sur {alertes.length} alertes au total</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={marquerToutesCommeLues}
                >
                  Marquer toutes comme lues
                </Button>
              </div>
            </DashboardCard>
            
            <DashboardCard
              title="Alertes par module"
              icon={<Search className="h-5 w-5" />}
            >
              <div className="space-y-2 py-2">
                {Object.entries(alertesParModule).map(([module, count]) => (
                  <div key={module} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getModuleIcon(module)}</span>
                      <span>{module}</span>
                    </div>
                    <Badge>{count}</Badge>
                  </div>
                ))}
              </div>
            </DashboardCard>
            
            <DashboardCard
              title="Alertes par niveau"
              icon={<AlertTriangle className="h-5 w-5" />}
            >
              <div className="space-y-2 py-2">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-500"></span>
                    <span>Critique</span>
                  </div>
                  <Badge>{alertesParNiveau.error || 0}</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-amber-500"></span>
                    <span>Avertissement</span>
                  </div>
                  <Badge>{alertesParNiveau.warning || 0}</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                    <span>Information</span>
                  </div>
                  <Badge>{alertesParNiveau.info || 0}</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-green-500"></span>
                    <span>Succès</span>
                  </div>
                  <Badge>{alertesParNiveau.success || 0}</Badge>
                </div>
              </div>
            </DashboardCard>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h3 className="text-lg font-semibold">Liste des alertes</h3>
                
                <div className="flex flex-wrap gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(startDate, 'dd/MM/yyyy')} - {format(endDate, 'dd/MM/yyyy')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="range"
                        defaultMonth={startDate}
                        selected={{
                          from: startDate,
                          to: endDate,
                        }}
                        onSelect={(range) => {
                          if (range?.from) setStartDate(range.from);
                          if (range?.to) setEndDate(range.to);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <select 
                    className="h-8 rounded-md border border-input bg-background px-3 py-1 text-sm"
                    value={filtreModule || ''}
                    onChange={(e) => setFiltreModule(e.target.value || null)}
                  >
                    <option value="">Tous les modules</option>
                    <option value="Tarifs">Tarifs</option>
                    <option value="Disponibilités">Disponibilités</option>
                    <option value="Staff">Staff</option>
                    <option value="Concurrence">Concurrence</option>
                  </select>
                  
                  <select 
                    className="h-8 rounded-md border border-input bg-background px-3 py-1 text-sm"
                    value={filtreNiveau || ''}
                    onChange={(e) => setFiltreNiveau(e.target.value || null)}
                  >
                    <option value="">Tous les niveaux</option>
                    <option value="error">Critique</option>
                    <option value="warning">Avertissement</option>
                    <option value="info">Information</option>
                    <option value="success">Succès</option>
                  </select>
                </div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Niveau</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alertesFiltrees.length > 0 ? alertesFiltrees.map((alerte) => (
                    <TableRow key={alerte.id} className={!alerte.lue ? 'bg-blue-50' : ''}>
                      <TableCell>{new Date(alerte.date).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getModuleIcon(alerte.module)}</span>
                          <span>{alerte.module}</span>
                        </div>
                      </TableCell>
                      <TableCell>{alerte.type}</TableCell>
                      <TableCell>{getNiveauBadge(alerte.niveau)}</TableCell>
                      <TableCell>{alerte.message}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {!alerte.lue && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => marquerCommeLue(alerte.id)}
                            >
                              Marquer comme lue
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              toast.success(`Redirection vers le module ${alerte.module}`);
                            }}
                          >
                            <ArrowUpRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        Aucune alerte ne correspond aux critères de recherche
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DashboardCard
              title="Générer un rapport"
              icon={<FileText className="h-5 w-5" />}
            >
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Période de rapport</h4>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(startDate, 'dd/MM/yyyy')} - {format(endDate, 'dd/MM/yyyy')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="range"
                        defaultMonth={startDate}
                        selected={{
                          from: startDate,
                          to: endDate,
                        }}
                        onSelect={(range) => {
                          if (range?.from) setStartDate(range.from);
                          if (range?.to) setEndDate(range.to);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Modules à inclure</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span>Tarifs</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span>Disponibilités</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span>Staff</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span>Concurrence</span>
                    </label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Format de rapport</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="format" value="pdf" defaultChecked className="rounded" />
                      <span>PDF</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="format" value="csv" className="rounded" />
                      <span>CSV</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="format" value="excel" className="rounded" />
                      <span>Excel</span>
                    </label>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-4 bg-hotel-primary hover:bg-hotel-primary/90"
                  onClick={exporterRapport}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Générer le rapport
                </Button>
              </div>
            </DashboardCard>
            
            <DashboardCard
              title="Rapports récents"
              icon={<FileText className="h-5 w-5" />}
            >
              <div className="space-y-3 py-2">
                <div className="p-3 bg-gray-50 rounded flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Rapport mensuel - Mars 2025</h4>
                    <p className="text-xs text-gray-500">Généré le 05/04/2025</p>
                  </div>
                  <Button size="sm" className="gap-1">
                    <Download className="h-4 w-4" />
                    PDF
                  </Button>
                </div>
                
                <div className="p-3 bg-gray-50 rounded flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Rapport hebdomadaire - Sem 13</h4>
                    <p className="text-xs text-gray-500">Généré le 31/03/2025</p>
                  </div>
                  <Button size="sm" className="gap-1">
                    <Download className="h-4 w-4" />
                    PDF
                  </Button>
                </div>
                
                <div className="p-3 bg-gray-50 rounded flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Rapport de concurrence</h4>
                    <p className="text-xs text-gray-500">Généré le 28/03/2025</p>
                  </div>
                  <Button size="sm" className="gap-1">
                    <Download className="h-4 w-4" />
                    PDF
                  </Button>
                </div>
                
                <div className="p-3 bg-gray-50 rounded flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Rapport des tarifs</h4>
                    <p className="text-xs text-gray-500">Généré le 25/03/2025</p>
                  </div>
                  <Button size="sm" className="gap-1">
                    <Download className="h-4 w-4" />
                    PDF
                  </Button>
                </div>
                
                <div className="p-3 bg-gray-50 rounded flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Rapport du personnel</h4>
                    <p className="text-xs text-gray-500">Généré le 20/03/2025</p>
                  </div>
                  <Button size="sm" className="gap-1">
                    <Download className="h-4 w-4" />
                    PDF
                  </Button>
                </div>
              </div>
            </DashboardCard>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Programmation des rapports</h3>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Fréquence</TableHead>
                    <TableHead>Dernière exécution</TableHead>
                    <TableHead>Prochaine exécution</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Rapport journalier</TableCell>
                    <TableCell>Quotidienne</TableCell>
                    <TableCell>07/04/2025</TableCell>
                    <TableCell>08/04/2025</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">Modifier</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Rapport hebdomadaire</TableCell>
                    <TableCell>Hebdomadaire</TableCell>
                    <TableCell>31/03/2025</TableCell>
                    <TableCell>07/04/2025</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">Modifier</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Rapport mensuel</TableCell>
                    <TableCell>Mensuelle</TableCell>
                    <TableCell>01/04/2025</TableCell>
                    <TableCell>01/05/2025</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">Modifier</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              
              <div className="mt-4 flex justify-end">
                <Button>
                  Ajouter un rapport programmé
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default AlertesPage;
