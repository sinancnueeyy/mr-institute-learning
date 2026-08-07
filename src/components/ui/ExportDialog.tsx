import { useState } from 'react';
import { Download, FileJson, FileSpreadsheet } from 'lucide-react';
import { Button } from './Button';
import { exportToCSV, exportToJSON } from '../../utils/exportUtils';

interface ExportDialogProps {
  data: any[];
  filename: string;
}

export function ExportDialog({ data, filename }: ExportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleExportCSV = () => {
    exportToCSV(data, filename);
    setIsOpen(false);
  };

  const handleExportJSON = () => {
    exportToJSON(data, filename);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <Download className="w-4 h-4 mr-2" />
        Export
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-fade-in">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-bold text-text-primary">Export Data</h3>
          <p className="text-sm text-text-secondary mt-1">Choose your preferred format</p>
        </div>
        
        <div className="p-4 space-y-3">
          <button 
            onClick={handleExportCSV}
            className="w-full flex items-center p-3 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="font-medium text-text-primary">CSV / Excel</div>
              <div className="text-xs text-text-secondary">Best for spreadsheets</div>
            </div>
          </button>
          
          <button 
            onClick={handleExportJSON}
            className="w-full flex items-center p-3 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
              <FileJson className="w-5 h-5" />
            </div>
            <div>
              <div className="font-medium text-text-primary">JSON</div>
              <div className="text-xs text-text-secondary">Best for developers & APIs</div>
            </div>
          </button>
        </div>
        
        <div className="p-4 bg-surface border-t border-border flex justify-end">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
