import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface SortableListProps<T> {
  items: T[];
  onReorder: (newItems: T[]) => void;
  onRemove?: (index: number) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
}

export function SortableList<T>({ items, onReorder, onRemove, renderItem }: SortableListProps<T>) {
  const moveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;
    onReorder(newItems);
  };

  const moveDown = (index: number) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;
    onReorder(newItems);
  };

  if (!items || items.length === 0) {
    return <div className="p-8 text-center text-text-muted bg-surface border border-border rounded-xl">No items added yet.</div>;
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="flex gap-4 items-center bg-white border border-border rounded-xl p-4 shadow-sm">
          <div className="flex flex-col gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-1 h-auto" 
              onClick={() => moveUp(index)}
              disabled={index === 0}
            >
              <ChevronUp className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-1 h-auto" 
              onClick={() => moveDown(index)}
              disabled={index === items.length - 1}
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1">
            {renderItem(item, index)}
          </div>
          {onRemove && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-error hover:bg-error/10" 
              onClick={() => onRemove(index)}
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
