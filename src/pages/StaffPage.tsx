
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import CsvUploader from '@/components/CsvUploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import DashboardCard from '@/components/DashboardCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface StaffData {
  date?: string;
  employeId?: string;
  nom?: string;
  poste?: string;
  departement?: string;
  present?: string;
  heureDebut?: string;
  heureFin?: string;
  [key: string]: string | undefined;
}

const StaffPage = () => {
  const [staffData, setStaffData] = useState<StaffData[]>([]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const handleCsvLoaded = (data: StaffData[]) => {
    setStaffData(data);
    console.log("Données du personnel chargées:", data);
  };
  
  const checkStaffing = () => {
    if (date) {
      setSelectedDate(date);
    }
  };
  
  // Calcul des statistiques pour la date sélectionnée
  const getStaffStats = () => {
    if (!selectedDate || !staffData.length) return null;
    
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    const staffForDate = staffData.filter(item => item.date === formattedDate);
    
    const totalStaff = staffForDate.length;
    const presentStaff = staffForDate.filter(staff => staff.present === 'true' || staff.present === '1').length;
    const presentRate = totalStaff > 0 ? Math.round((presentStaff / totalStaff) * 100) : 0;
    
    // Compter par département
    const departments: Record<string, { total: number, present: number }> = {};
    
    staffForDate.forEach(staff => {
      const department = staff.departement || 'Autre';
      if (!departments[department]) {
        departments[department] = { total: 0, present: 0 };
      }
      
      departments[department].total++;
      if (staff.present === 'true' || staff.present === '1') {
        departments[department].present++;
      }
    });
    
    return {
      date: formattedDate,
      totalStaff,
      presentStaff,
      presentRate,
      departments
    };
  };
  
  const staffStats = getStaffStats();
  
  // Générer un avatar fallback à partir du nom
  const getInitials = (name: string) => {
    if (!name) return 'XX';
    const nameParts = name.split(' ');
    if (nameParts.length === 1) return nameParts[0].substring(0, 2).toUpperCase();
    return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
  };
  
  // Définir une couleur en fonction du département
  const getDepartmentColor = (department: string) => {
    const colors: Record<string, string> = {
      'Reception': 'bg-blue-500',
      'Menage': 'bg-green-500',
      'Maintenance': 'bg-amber-500',
      'Restaurant': 'bg-red-500',
      'Direction': 'bg-purple-500'
    };
    
    return colors[department] || 'bg-gray-500';
  };
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Staff</h1>
        <p className="text-gray-600">Consultez la présence du personnel pour une date donnée</p>
      </div>
      
      <Tabs defaultValue="staffing">
        <TabsList className="mb-6">
          <TabsTrigger value="staffing">Planning du personnel</TabsTrigger>
          <TabsTrigger value="management">Gestion des données</TabsTrigger>
          <TabsTrigger value="data">Données brutes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="staffing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Sélectionner une date</h3>
                
                <div className="space-y-4">
                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, 'PPP', { locale: fr }) : "Sélectionner une date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <Button 
                    className="w-full bg-hotel-primary hover:bg-hotel-primary/90"
                    onClick={checkStaffing}
                    disabled={!date || staffData.length === 0}
                  >
                    Vérifier le planning
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="lg:col-span-2">
              <DashboardCard
                title={`Planning - ${selectedDate ? format(selectedDate, 'PPP', { locale: fr }) : "Non sélectionné"}`}
                icon={<Users className="h-5 w-5" />}
              >
                {staffStats ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <span className="text-sm text-gray-500">Taux de présence</span>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-2xl font-bold text-hotel-primary">{staffStats.presentRate}%</span>
                        </div>
                        <Progress value={staffStats.presentRate} className="h-2 mt-2" />
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <span className="text-sm text-gray-500">Personnel présent</span>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-2xl font-bold text-hotel-primary">{staffStats.presentStaff}/{staffStats.totalStaff}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">Présence par département</h4>
                      
                      <div className="space-y-2">
                        {Object.entries(staffStats.departments).map(([dept, data]) => (
                          <div key={dept} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                              <div className={`h-3 w-3 rounded-full ${getDepartmentColor(dept)}`}></div>
                              <span className="capitalize">{dept}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>{data.present}/{data.total} présents</span>
                              {data.present < data.total && (
                                <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                                  Personnel réduit
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : staffData.length === 0 ? (
                  <div className="text-center p-8">
                    <p className="text-gray-500">Aucune donnée de personnel importée</p>
                    <p className="text-sm text-gray-400 mt-1">Importez des données dans l'onglet "Gestion des données"</p>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <p className="text-gray-500">Sélectionnez une date et cliquez sur "Vérifier le planning"</p>
                  </div>
                )}
              </DashboardCard>
            </div>
          </div>
          
          {staffStats && (
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-4">Détails du personnel pour le {format(selectedDate!, 'PPP', { locale: fr })}</h3>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employé</TableHead>
                      <TableHead>Poste</TableHead>
                      <TableHead>Département</TableHead>
                      <TableHead>Horaires</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staffData
                      .filter(item => item.date === format(selectedDate!, 'yyyy-MM-dd'))
                      .map((staff, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="" />
                                <AvatarFallback className={`${getDepartmentColor(staff.departement || '')} text-white text-xs`}>
                                  {getInitials(staff.nom || '')}
                                </AvatarFallback>
                              </Avatar>
                              <span>{staff.nom}</span>
                            </div>
                          </TableCell>
                          <TableCell>{staff.poste}</TableCell>
                          <TableCell>{staff.departement}</TableCell>
                          <TableCell>
                            {staff.present === 'true' || staff.present === '1' ? (
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span>{staff.heureDebut} - {staff.heureFin}</span>
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {staff.present === 'true' || staff.present === '1' ? (
                              <div className="flex items-center gap-2 text-green-600">
                                <CheckCircle className="h-4 w-4" />
                                <span>Présent</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-red-600">
                                <XCircle className="h-4 w-4" />
                                <span>Absent</span>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="management">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CsvUploader 
              onCsvLoaded={handleCsvLoaded} 
              title="Importer des données du personnel" 
              description="Glissez-déposez un fichier CSV contenant les présences du personnel ou cliquez pour parcourir"
            />
            
            <DashboardCard
              title="Informations sur le personnel"
              icon={<Users className="h-5 w-5" />}
            >
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Format de fichier attendu</h4>
                  <p className="text-sm text-gray-600">
                    Le fichier CSV doit contenir les colonnes suivantes:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                    <li>date (format: YYYY-MM-DD)</li>
                    <li>employeId (identifiant de l'employé)</li>
                    <li>nom (nom complet de l'employé)</li>
                    <li>poste (fonction de l'employé)</li>
                    <li>departement (service de l'employé)</li>
                    <li>present (true/false ou 1/0)</li>
                    <li>heureDebut (format: HH:MM)</li>
                    <li>heureFin (format: HH:MM)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Départements</h4>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm">Réception</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span className="text-sm">Ménage</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                      <span className="text-sm">Maintenance</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <span className="text-sm">Restaurant</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                      <span className="text-sm">Direction</span>
                    </div>
                  </div>
                </div>
              </div>
            </DashboardCard>
          </div>
        </TabsContent>
        
        <TabsContent value="data">
          {staffData.length > 0 ? (
            <Card>
              <CardContent className="p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Poste</TableHead>
                      <TableHead>Département</TableHead>
                      <TableHead>Présent</TableHead>
                      <TableHead>Horaires</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staffData.slice(0, 10).map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.nom}</TableCell>
                        <TableCell>{row.poste}</TableCell>
                        <TableCell>{row.departement}</TableCell>
                        <TableCell>
                          {row.present === 'true' || row.present === '1' ? (
                            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                              Présent
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                              Absent
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {row.present === 'true' || row.present === '1' ? `${row.heureDebut} - ${row.heureFin}` : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {staffData.length > 10 && (
                  <div className="text-center mt-4 text-sm text-gray-500">
                    Affichage des 10 premières lignes sur {staffData.length}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed">
              <p className="text-gray-500">Aucune donnée de personnel importée</p>
              <p className="text-sm text-gray-400 mt-1">Importez des données dans l'onglet "Gestion des données"</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default StaffPage;
