
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import CsvUploader from '@/components/CsvUploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { PopoverContent, PopoverTrigger, Popover } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, BedDouble, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import DashboardCard from '@/components/DashboardCard';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

interface DisponibiliteData {
  date?: string;
  chambreId?: string;
  chambreType?: string;
  disponible?: string;
  [key: string]: string | undefined;
}

const DisponibilitesPage = () => {
  const [disponibiliteData, setDisponibiliteData] = useState<DisponibiliteData[]>([]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const handleCsvLoaded = (data: DisponibiliteData[]) => {
    setDisponibiliteData(data);
    console.log("Données de disponibilité chargées:", data);
  };
  
  const checkAvailability = () => {
    if (date) {
      setSelectedDate(date);
    }
  };
  
  // Calcul des statistiques pour la date sélectionnée
  const getDateStats = () => {
    if (!selectedDate || !disponibiliteData.length) return null;
    
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    const roomsForDate = disponibiliteData.filter(item => item.date === formattedDate);
    
    const totalRooms = roomsForDate.length || 45; // Si aucune donnée, on suppose 45 chambres
    const availableRooms = roomsForDate.filter(room => room.disponible === 'true' || room.disponible === '1').length;
    const occupationRate = totalRooms > 0 ? Math.round((1 - availableRooms / totalRooms) * 100) : 0;
    
    // Compter par type
    const roomTypes: Record<string, { total: number, available: number }> = {
      'standard': { total: 0, available: 0 },
      'superieure': { total: 0, available: 0 },
      'suite': { total: 0, available: 0 },
    };
    
    roomsForDate.forEach(room => {
      const type = (room.chambreType || 'standard').toLowerCase();
      if (roomTypes[type]) {
        roomTypes[type].total++;
        if (room.disponible === 'true' || room.disponible === '1') {
          roomTypes[type].available++;
        }
      }
    });
    
    return {
      date: formattedDate,
      totalRooms,
      availableRooms,
      occupationRate,
      roomTypes
    };
  };
  
  const dateStats = getDateStats();
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Disponibilités</h1>
        <p className="text-gray-600">Consultez la disponibilité des chambres pour une date donnée</p>
      </div>
      
      <Tabs defaultValue="availability">
        <TabsList className="mb-6">
          <TabsTrigger value="availability">Disponibilité des chambres</TabsTrigger>
          <TabsTrigger value="management">Gestion des données</TabsTrigger>
          <TabsTrigger value="data">Données brutes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="availability" className="space-y-6">
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
                    onClick={checkAvailability}
                    disabled={!date || disponibiliteData.length === 0}
                  >
                    Vérifier la disponibilité
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="lg:col-span-2">
              <DashboardCard
                title={`Disponibilité - ${selectedDate ? format(selectedDate, 'PPP', { locale: fr }) : "Non sélectionné"}`}
                icon={<BedDouble className="h-5 w-5" />}
              >
                {dateStats ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <span className="text-sm text-gray-500">Taux d'occupation</span>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-2xl font-bold text-hotel-primary">{dateStats.occupationRate}%</span>
                        </div>
                        <Progress value={dateStats.occupationRate} className="h-2 mt-2" />
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <span className="text-sm text-gray-500">Chambres disponibles</span>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-2xl font-bold text-hotel-primary">{dateStats.availableRooms}/{dateStats.totalRooms}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">Disponibilité par type de chambre</h4>
                      
                      <div className="space-y-2">
                        {Object.entries(dateStats.roomTypes).map(([type, data]) => (
                          <div key={type} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                              <BedDouble className="h-4 w-4 text-gray-500" />
                              <span className="capitalize">{type}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>{data.available}/{data.total} disponibles</span>
                              <Badge 
                                variant="outline" 
                                className={`${data.available > 0 ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}
                              >
                                {data.available > 0 ? 'Disponible' : 'Complet'}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : disponibiliteData.length === 0 ? (
                  <div className="text-center p-8">
                    <p className="text-gray-500">Aucune donnée de disponibilité importée</p>
                    <p className="text-sm text-gray-400 mt-1">Importez des données dans l'onglet "Gestion des données"</p>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <p className="text-gray-500">Sélectionnez une date et cliquez sur "Vérifier la disponibilité"</p>
                  </div>
                )}
              </DashboardCard>
            </div>
          </div>
          
          {dateStats && (
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-4">Détails des chambres pour le {format(selectedDate!, 'PPP', { locale: fr })}</h3>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>N° Chambre</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {disponibiliteData
                      .filter(item => item.date === format(selectedDate!, 'yyyy-MM-dd'))
                      .map((room, index) => (
                        <TableRow key={index}>
                          <TableCell>{room.chambreId}</TableCell>
                          <TableCell className="capitalize">{room.chambreType}</TableCell>
                          <TableCell>
                            {room.disponible === 'true' || room.disponible === '1' ? (
                              <div className="flex items-center gap-2 text-green-600">
                                <CheckCircle className="h-4 w-4" />
                                <span>Disponible</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-red-600">
                                <XCircle className="h-4 w-4" />
                                <span>Occupée</span>
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
              title="Importer des données de disponibilité" 
              description="Glissez-déposez un fichier CSV contenant vos disponibilités ou cliquez pour parcourir"
            />
            
            <DashboardCard
              title="Informations sur les disponibilités"
              icon={<BedDouble className="h-5 w-5" />}
            >
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Format de fichier attendu</h4>
                  <p className="text-sm text-gray-600">
                    Le fichier CSV doit contenir les colonnes suivantes:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                    <li>date (format: YYYY-MM-DD)</li>
                    <li>chambreId (identifiant de la chambre)</li>
                    <li>chambreType (standard, superieure, suite)</li>
                    <li>disponible (true/false ou 1/0)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Informations sur l'hôtel</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    <li>Nombre total de chambres: 45</li>
                    <li>Chambres standard: 25</li>
                    <li>Chambres supérieures: 15</li>
                    <li>Suites: 5</li>
                  </ul>
                </div>
              </div>
            </DashboardCard>
          </div>
        </TabsContent>
        
        <TabsContent value="data">
          {disponibiliteData.length > 0 ? (
            <Card>
              <CardContent className="p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>N° Chambre</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Disponible</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {disponibiliteData.slice(0, 10).map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.chambreId}</TableCell>
                        <TableCell className="capitalize">{row.chambreType}</TableCell>
                        <TableCell>
                          {row.disponible === 'true' || row.disponible === '1' ? (
                            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                              Disponible
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                              Occupée
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {disponibiliteData.length > 10 && (
                  <div className="text-center mt-4 text-sm text-gray-500">
                    Affichage des 10 premières lignes sur {disponibiliteData.length}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed">
              <p className="text-gray-500">Aucune donnée de disponibilité importée</p>
              <p className="text-sm text-gray-400 mt-1">Importez des données dans l'onglet "Gestion des données"</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default DisponibilitesPage;
