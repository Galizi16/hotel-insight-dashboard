
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import CsvUploader from '@/components/CsvUploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, BarChart3, TrendingUp, TrendingDown, Hotel } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import DashboardCard from '@/components/DashboardCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { 
  Area,
  AreaChart, 
  Bar, 
  BarChart,
  CartesianGrid, 
  Legend, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts';

interface ConcurrentData {
  date?: string;
  hotelId?: string;
  hotelNom?: string;
  categorie?: string;
  chambreType?: string;
  tarifPublic?: string;
  [key: string]: string | undefined;
}

const ConcurrencePage = () => {
  const [concurrentData, setConcurrentData] = useState<ConcurrentData[]>([]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const handleCsvLoaded = (data: ConcurrentData[]) => {
    setConcurrentData(data);
    console.log("Données concurrentielles chargées:", data);
  };
  
  const checkConcurrents = () => {
    if (date) {
      setSelectedDate(date);
    }
  };
  
  // Calcul des statistiques pour la date sélectionnée
  const getConcurrentAnalysis = () => {
    if (!selectedDate || !concurrentData.length) return null;
    
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    const dataForDate = concurrentData.filter(item => item.date === formattedDate);
    
    if (dataForDate.length === 0) return null;
    
    // Calculer le prix moyen par type de chambre pour chaque hôtel
    const hotelData: Record<string, Record<string, number>> = {};
    
    dataForDate.forEach(item => {
      const hotelName = item.hotelNom || 'Inconnu';
      const roomType = (item.chambreType || 'standard').toLowerCase();
      const price = parseFloat(item.tarifPublic || '0');
      
      if (!hotelData[hotelName]) {
        hotelData[hotelName] = {};
      }
      
      hotelData[hotelName][roomType] = price;
    });
    
    // Mon hôtel est supposé être le premier de la liste
    const myHotelName = Object.keys(hotelData)[0];
    const myHotelData = hotelData[myHotelName];
    
    // Calculer les différences de prix
    const priceDifferences: Record<string, Record<string, number>> = {};
    const averageDifferences: Record<string, number> = {};
    
    Object.entries(hotelData).forEach(([hotelName, prices]) => {
      if (hotelName !== myHotelName) {
        priceDifferences[hotelName] = {};
        let totalDiff = 0;
        let count = 0;
        
        Object.entries(prices).forEach(([roomType, price]) => {
          if (myHotelData[roomType]) {
            const diff = ((price - myHotelData[roomType]) / myHotelData[roomType]) * 100;
            priceDifferences[hotelName][roomType] = parseFloat(diff.toFixed(1));
            totalDiff += diff;
            count++;
          }
        });
        
        if (count > 0) {
          averageDifferences[hotelName] = parseFloat((totalDiff / count).toFixed(1));
        }
      }
    });
    
    // Données pour le graphique
    const chartData = Object.keys(myHotelData).map(roomType => {
      const data: Record<string, any> = { roomType };
      
      Object.entries(hotelData).forEach(([hotelName, prices]) => {
        if (prices[roomType]) {
          data[hotelName] = prices[roomType];
        }
      });
      
      return data;
    });
    
    return {
      date: formattedDate,
      myHotelName,
      hotelData,
      priceDifferences,
      averageDifferences,
      chartData
    };
  };
  
  const concurrentAnalysis = getConcurrentAnalysis();
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Concurrence</h1>
        <p className="text-gray-600">Analysez les tarifs de la concurrence pour ajuster vos prix</p>
      </div>
      
      <Tabs defaultValue="analysis">
        <TabsList className="mb-6">
          <TabsTrigger value="analysis">Analyse concurrentielle</TabsTrigger>
          <TabsTrigger value="management">Gestion des données</TabsTrigger>
          <TabsTrigger value="data">Données brutes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analysis" className="space-y-6">
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
                    onClick={checkConcurrents}
                    disabled={!date || concurrentData.length === 0}
                  >
                    Analyser la concurrence
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="lg:col-span-2">
              <DashboardCard
                title={`Analyse concurrentielle - ${selectedDate ? format(selectedDate, 'PPP', { locale: fr }) : "Non sélectionnée"}`}
                icon={<BarChart3 className="h-5 w-5" />}
              >
                {concurrentAnalysis ? (
                  <div className="space-y-4">
                    <h4 className="font-medium">Différence de prix moyenne par concurrent</h4>
                    <div className="space-y-2">
                      {Object.entries(concurrentAnalysis.averageDifferences).map(([hotelName, diff]) => (
                        <div key={hotelName} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            <Hotel className="h-4 w-4 text-gray-500" />
                            <span>{hotelName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={diff > 0 ? "text-green-600 flex items-center" : "text-red-600 flex items-center"}>
                              {diff > 0 ? (
                                <TrendingUp className="h-4 w-4 mr-1" />
                              ) : (
                                <TrendingDown className="h-4 w-4 mr-1" />
                              )}
                              <span>{diff > 0 ? '+' : ''}{diff}%</span>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={diff > 0 
                                ? 'bg-green-50 text-green-600 border-green-200' 
                                : 'bg-red-50 text-red-600 border-red-200'
                              }
                            >
                              {diff > 0 ? 'Plus cher' : 'Moins cher'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="h-[200px] mt-6">
                      <h4 className="font-medium mb-2">Comparaison des tarifs par type de chambre</h4>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={concurrentAnalysis.chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="roomType" />
                          <YAxis />
                          <Tooltip formatter={(value) => `${value}€`} />
                          <Legend />
                          {Object.keys(concurrentAnalysis.hotelData).map((hotelName, index) => (
                            <Bar 
                              key={hotelName} 
                              dataKey={hotelName} 
                              name={hotelName}
                              fill={index === 0 ? '#1E3A8A' : ['#06B6D4', '#8B5CF6', '#F59E0B', '#EF4444'][index % 4]}
                            />
                          ))}
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                ) : concurrentData.length === 0 ? (
                  <div className="text-center p-8">
                    <p className="text-gray-500">Aucune donnée de concurrence importée</p>
                    <p className="text-sm text-gray-400 mt-1">Importez des données dans l'onglet "Gestion des données"</p>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <p className="text-gray-500">Sélectionnez une date et cliquez sur "Analyser la concurrence"</p>
                  </div>
                )}
              </DashboardCard>
            </div>
          </div>
          
          {concurrentAnalysis && (
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-4">Détails des tarifs pour le {format(selectedDate!, 'PPP', { locale: fr })}</h3>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hôtel</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Chambre Standard</TableHead>
                      <TableHead>Chambre Supérieure</TableHead>
                      <TableHead>Suite</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(concurrentAnalysis.hotelData).map(([hotelName, prices], index) => (
                      <TableRow key={hotelName} className={index === 0 ? "bg-blue-50" : ""}>
                        <TableCell className="font-medium">
                          {hotelName} {index === 0 && <Badge className="ml-2">Votre hôtel</Badge>}
                        </TableCell>
                        <TableCell>
                          {concurrentData.find(d => d.hotelNom === hotelName)?.categorie || '3★'}
                        </TableCell>
                        <TableCell>{prices.standard ? `${prices.standard}€` : '-'}</TableCell>
                        <TableCell>{prices.superieure ? `${prices.superieure}€` : '-'}</TableCell>
                        <TableCell>{prices.suite ? `${prices.suite}€` : '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
          
          {concurrentAnalysis && concurrentAnalysis.chartData.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Évolution des prix sur 7 jours</h3>
                
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { date: '01/04', myHotel: 120, concurrent1: 130, concurrent2: 110 },
                        { date: '02/04', myHotel: 125, concurrent1: 140, concurrent2: 115 },
                        { date: '03/04', myHotel: 130, concurrent1: 145, concurrent2: 120 },
                        { date: '04/04', myHotel: 135, concurrent1: 150, concurrent2: 125 },
                        { date: '05/04', myHotel: 140, concurrent1: 155, concurrent2: 130 },
                        { date: '06/04', myHotel: 145, concurrent1: 160, concurrent2: 135 },
                        { date: '07/04', myHotel: 150, concurrent1: 165, concurrent2: 140 }
                      ]}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => `${value}€`} />
                      <Legend />
                      <Area type="monotone" dataKey="myHotel" name="Votre hôtel" stroke="#1E3A8A" fill="#1E3A8A" fillOpacity={0.3} />
                      <Area type="monotone" dataKey="concurrent1" name="Hôtel voisin 1" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.3} />
                      <Area type="monotone" dataKey="concurrent2" name="Hôtel voisin 2" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                
                <p className="text-sm text-gray-500 mt-4">
                  Note: Ce graphique montre une simulation de l'évolution des prix sur 7 jours pour les chambres standard. Importez des données historiques pour obtenir un graphique réel.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="management">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CsvUploader 
              onCsvLoaded={handleCsvLoaded} 
              title="Importer des données concurrentielles" 
              description="Glissez-déposez un fichier CSV contenant les tarifs de la concurrence ou cliquez pour parcourir"
            />
            
            <DashboardCard
              title="Informations sur la concurrence"
              icon={<BarChart3 className="h-5 w-5" />}
            >
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Format de fichier attendu</h4>
                  <p className="text-sm text-gray-600">
                    Le fichier CSV doit contenir les colonnes suivantes:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                    <li>date (format: YYYY-MM-DD)</li>
                    <li>hotelId (identifiant de l'hôtel)</li>
                    <li>hotelNom (nom de l'hôtel)</li>
                    <li>categorie (catégorie de l'hôtel: 3★, 4★, etc.)</li>
                    <li>chambreType (standard, superieure, suite)</li>
                    <li>tarifPublic (prix public en €)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Recommandations</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    <li>Le premier hôtel de votre liste doit être le vôtre</li>
                    <li>Incluez au moins 2-3 concurrents directs</li>
                    <li>Pour une analyse plus précise, utilisez des hôtels de catégorie similaire</li>
                    <li>Mettez à jour les données régulièrement pour une analyse pertinente</li>
                  </ul>
                </div>
              </div>
            </DashboardCard>
          </div>
        </TabsContent>
        
        <TabsContent value="data">
          {concurrentData.length > 0 ? (
            <Card>
              <CardContent className="p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Hôtel</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Type de chambre</TableHead>
                      <TableHead>Tarif public</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {concurrentData.slice(0, 10).map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.hotelNom}</TableCell>
                        <TableCell>{row.categorie}</TableCell>
                        <TableCell className="capitalize">{row.chambreType}</TableCell>
                        <TableCell>{row.tarifPublic}€</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {concurrentData.length > 10 && (
                  <div className="text-center mt-4 text-sm text-gray-500">
                    Affichage des 10 premières lignes sur {concurrentData.length}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed">
              <p className="text-gray-500">Aucune donnée de concurrence importée</p>
              <p className="text-sm text-gray-400 mt-1">Importez des données dans l'onglet "Gestion des données"</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default ConcurrencePage;
