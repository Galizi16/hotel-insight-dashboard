
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import CsvUploader from '@/components/CsvUploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarIcon, Tag, BarChart3 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import DashboardCard from '@/components/DashboardCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface TarifData {
  date?: string;
  chambreType?: string;
  tarifBase?: string;
  tarifSpecial?: string;
  tarifWeekend?: string;
  [key: string]: string | undefined;
}

const TarifsPage = () => {
  const [tarifData, setTarifData] = useState<TarifData[]>([]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [chambreType, setChambreType] = useState<string>('standard');
  const [nombrePersonnes, setNombrePersonnes] = useState<string>('1');
  const [nombreNuits, setNombreNuits] = useState<string>('1');
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  
  const handleCsvLoaded = (data: TarifData[]) => {
    setTarifData(data);
    console.log("Données chargées:", data);
  };
  
  const calculatePrice = () => {
    if (!date || !tarifData.length) return;
    
    const formattedDate = format(date, 'yyyy-MM-dd');
    const isWeekend = [0, 6].includes(date.getDay()); // 0 = Dimanche, 6 = Samedi
    
    // Rechercher le tarif pour cette date et ce type de chambre
    const tarifRow = tarifData.find(
      item => item.date === formattedDate && 
      item.chambreType?.toLowerCase() === chambreType.toLowerCase()
    );
    
    if (!tarifRow) {
      // Utiliser un tarif par défaut si la date spécifique n'est pas trouvée
      const defaultTarif = tarifData.find(
        item => item.chambreType?.toLowerCase() === chambreType.toLowerCase()
      );
      
      if (!defaultTarif) {
        setCalculatedPrice(null);
        return;
      }
      
      let baseTarif = parseFloat(isWeekend ? 
        (defaultTarif.tarifWeekend || defaultTarif.tarifBase || '0') : 
        (defaultTarif.tarifBase || '0')
      );
      
      // Ajuster en fonction du nombre de personnes
      if (nombrePersonnes === '2') baseTarif *= 1.2;
      else if (nombrePersonnes === '3') baseTarif *= 1.4;
      else if (nombrePersonnes === '4') baseTarif *= 1.6;
      
      // Ajuster pour le nombre de nuits avec une légère réduction pour les séjours plus longs
      const nuits = parseInt(nombreNuits);
      let totalPrice = baseTarif * nuits;
      if (nuits >= 3) totalPrice *= 0.95;
      if (nuits >= 7) totalPrice *= 0.9;
      
      setCalculatedPrice(Math.round(totalPrice));
    } else {
      // Utiliser le tarif trouvé pour la date spécifique
      let baseTarif = parseFloat(isWeekend ? 
        (tarifRow.tarifWeekend || tarifRow.tarifBase || '0') : 
        (tarifRow.tarifBase || '0')
      );
      
      // Ajustements comme ci-dessus
      if (nombrePersonnes === '2') baseTarif *= 1.2;
      else if (nombrePersonnes === '3') baseTarif *= 1.4;
      else if (nombrePersonnes === '4') baseTarif *= 1.6;
      
      const nuits = parseInt(nombreNuits);
      let totalPrice = baseTarif * nuits;
      if (nuits >= 3) totalPrice *= 0.95;
      if (nuits >= 7) totalPrice *= 0.9;
      
      setCalculatedPrice(Math.round(totalPrice));
    }
  };
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tarifs</h1>
        <p className="text-gray-600">Gérez vos tarifs et calculez des prix de séjour</p>
      </div>
      
      <Tabs defaultValue="calculator">
        <TabsList className="mb-6">
          <TabsTrigger value="calculator">Calculateur de tarifs</TabsTrigger>
          <TabsTrigger value="management">Gestion des tarifs</TabsTrigger>
          <TabsTrigger value="data">Données tarifaires</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calculator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Calculer un prix de séjour</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="check-in">Date d'arrivée</Label>
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="room-type">Type de chambre</Label>
                    <Select value={chambreType} onValueChange={setChambreType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="superieure">Supérieure</SelectItem>
                        <SelectItem value="suite">Suite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="persons">Nombre de personnes</Label>
                    <Select value={nombrePersonnes} onValueChange={setNombrePersonnes}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 personne</SelectItem>
                        <SelectItem value="2">2 personnes</SelectItem>
                        <SelectItem value="3">3 personnes</SelectItem>
                        <SelectItem value="4">4 personnes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nights">Nombre de nuits</Label>
                    <Input
                      id="nights"
                      type="number"
                      min="1"
                      max="30"
                      value={nombreNuits}
                      onChange={(e) => setNombreNuits(e.target.value)}
                    />
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-hotel-primary hover:bg-hotel-primary/90"
                  onClick={calculatePrice}
                  disabled={!date || tarifData.length === 0}
                >
                  Calculer le prix
                </Button>
              </CardContent>
            </Card>
            
            <DashboardCard
              title="Résultat du calcul"
              icon={<Tag className="h-5 w-5" />}
            >
              <div className="flex flex-col items-center justify-center h-full py-6">
                {calculatedPrice !== null ? (
                  <>
                    <span className="text-3xl font-bold text-hotel-primary mb-2">
                      {calculatedPrice}€
                    </span>
                    <div className="text-sm text-gray-500 text-center">
                      <p>Prix total pour {nombreNuits} nuit{parseInt(nombreNuits) > 1 ? 's' : ''}</p>
                      <p>Chambre {chambreType} - {nombrePersonnes} personne{parseInt(nombrePersonnes) > 1 ? 's' : ''}</p>
                      <p>À partir du {date ? format(date, 'PPP', { locale: fr }) : ""}</p>
                    </div>
                  </>
                ) : tarifData.length === 0 ? (
                  <div className="text-center text-gray-500">
                    <p>Veuillez importer des données tarifaires</p>
                    <p className="text-sm">Allez dans l'onglet "Gestion des tarifs"</p>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <p>Complétez les informations et cliquez sur "Calculer le prix"</p>
                  </div>
                )}
              </div>
            </DashboardCard>
          </div>
        </TabsContent>
        
        <TabsContent value="management">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CsvUploader 
              onCsvLoaded={handleCsvLoaded} 
              title="Importer des données tarifaires" 
              description="Glissez-déposez un fichier CSV contenant vos tarifs ou cliquez pour parcourir"
            />
            
            <DashboardCard
              title="Informations sur les tarifs"
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
                    <li>chambreType (standard, superieure, suite)</li>
                    <li>tarifBase (prix de base en €)</li>
                    <li>tarifSpecial (prix spécial en €, optionnel)</li>
                    <li>tarifWeekend (prix weekend en €, optionnel)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Règles de calcul des tarifs</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    <li>Le tarif weekend s'applique les vendredis et samedis</li>
                    <li>+20% pour 2 personnes, +40% pour 3 personnes, +60% pour 4 personnes</li>
                    <li>-5% pour les séjours de 3 nuits ou plus</li>
                    <li>-10% pour les séjours de 7 nuits ou plus</li>
                  </ul>
                </div>
              </div>
            </DashboardCard>
          </div>
        </TabsContent>
        
        <TabsContent value="data">
          {tarifData.length > 0 ? (
            <Card>
              <CardContent className="p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type de chambre</TableHead>
                      <TableHead>Tarif de base</TableHead>
                      <TableHead>Tarif spécial</TableHead>
                      <TableHead>Tarif weekend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tarifData.slice(0, 10).map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.chambreType}</TableCell>
                        <TableCell>{row.tarifBase}€</TableCell>
                        <TableCell>{row.tarifSpecial ? `${row.tarifSpecial}€` : '-'}</TableCell>
                        <TableCell>{row.tarifWeekend ? `${row.tarifWeekend}€` : '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {tarifData.length > 10 && (
                  <div className="text-center mt-4 text-sm text-gray-500">
                    Affichage des 10 premières lignes sur {tarifData.length}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed">
              <p className="text-gray-500">Aucune donnée tarifaire importée</p>
              <p className="text-sm text-gray-400 mt-1">Importez des données dans l'onglet "Gestion des tarifs"</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default TarifsPage;
