import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { FileSpreadsheet, FileText } from 'lucide-react';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExportCSV: () => void;
  onPrint: () => void;
}

export function ExportDialog({ isOpen, onClose, onExportCSV, onPrint }: ExportDialogProps) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Export Options"
      description="Select how you would like to export this data."
    >
      <div className="grid grid-cols-2 gap-4 mt-4">
        <Button 
          variant="outline" 
          className="h-24 flex flex-col items-center justify-center gap-2"
          onClick={() => {
            onExportCSV();
            onClose();
          }}
        >
          <FileSpreadsheet className="w-8 h-8 text-success" />
          <span>Export CSV</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-24 flex flex-col items-center justify-center gap-2"
          onClick={() => {
            onPrint();
            onClose();
          }}
        >
          <FileText className="w-8 h-8 text-brand-secondary" />
          <span>Print / PDF</span>
        </Button>
      </div>
    </Dialog>
  );
}
