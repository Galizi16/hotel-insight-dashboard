
import { ChangeEvent, DragEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Upload, FileIcon, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface CsvUploaderProps {
  onCsvLoaded: (data: any[]) => void;
  title?: string;
  description?: string;
}

const CsvUploader = ({ onCsvLoaded, title = "Importer des données", description = "Glissez-déposez un fichier CSV ou cliquez pour parcourir" }: CsvUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const processFile = async (file: File) => {
    setIsLoading(true);
    setFileName(file.name);
    
    try {
      const text = await file.text();
      const result = parseCSV(text);
      onCsvLoaded(result);
      toast.success("Fichier CSV importé avec succès");
    } catch (error) {
      console.error("Erreur lors du traitement du fichier CSV:", error);
      toast.error("Erreur lors de l'importation du fichier CSV");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === "text/csv" || file.name.endsWith('.csv')) {
        processFile(file);
      } else {
        toast.error("Veuillez fournir un fichier CSV valide");
      }
    }
  };
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type === "text/csv" || file.name.endsWith('.csv')) {
        processFile(file);
      } else {
        toast.error("Veuillez fournir un fichier CSV valide");
      }
    }
  };
  
  // Fonction simple pour parser un CSV
  const parseCSV = (text: string) => {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    
    return lines.slice(1).filter(line => line.trim() !== '').map(line => {
      const values = line.split(',').map(value => value.trim());
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index];
        return obj;
      }, {} as Record<string, string>);
    });
  };
  
  return (
    <Card className="w-full">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        
        <div
          className={`csv-drop-zone ${isDragging ? 'border-primary' : ''} ${fileName ? 'bg-muted/30' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isLoading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin-slow mb-3">
                <Upload size={40} className="text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Traitement du fichier...</p>
            </div>
          ) : fileName ? (
            <div className="flex flex-col items-center">
              <FileIcon size={40} className="text-hotel-primary mb-3" />
              <p className="font-medium">{fileName}</p>
              <p className="text-sm text-muted-foreground mt-1">Fichier importé avec succès</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={() => {
                  setFileName(null);
                }}
              >
                Remplacer le fichier
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload size={40} className="text-muted-foreground mb-3" />
              <p className="text-muted-foreground">{description}</p>
              <p className="text-xs text-muted-foreground mt-2">Format supporté: CSV</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                Parcourir
              </Button>
            </div>
          )}
          
          <input
            id="file-upload"
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        
        {!fileName && !isLoading && (
          <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
            <AlertCircle size={14} />
            <span>Pour de meilleurs résultats, assurez-vous que votre fichier CSV contient des en-têtes de colonne.</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CsvUploader;
