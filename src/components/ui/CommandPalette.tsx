import { useEffect, useState, useRef, cloneElement } from 'react';
import type { ReactElement } from 'react';
import { Search, FileText, Settings, Users, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants';

interface CommandItem {
  id: string;
  title: string;
  type: 'page' | 'setting' | 'action' | 'record';
  url: string;
  icon?: React.ReactNode;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Static global search data
  const items: CommandItem[] = [
    { id: '1', title: 'Dashboard', type: 'page', url: ROUTES.OFFICE.DASHBOARD, icon: <FileText /> },
    { id: '2', title: 'Developer Settings', type: 'setting', url: ROUTES.DEVELOPER.SETTINGS, icon: <Settings /> },
    { id: '3', title: 'Admissions Management', type: 'page', url: ROUTES.OFFICE.APPLICATIONS, icon: <Users /> },
    { id: '4', title: 'Student Directory', type: 'page', url: ROUTES.OFFICE.STUDENTS, icon: <Users /> },
    { id: '5', title: 'Website Homepage', type: 'page', url: ROUTES.DEVELOPER.CMS.HOMEPAGE, icon: <FileText /> },
  ];

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filteredItems.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' && filteredItems.length > 0) {
      e.preventDefault();
      handleSelect(filteredItems[selectedIndex]);
    }
  };

  const handleSelect = (item: CommandItem) => {
    setIsOpen(false);
    navigate(item.url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4 bg-black/50 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true" aria-label="Command Palette">
      <div 
        className="w-full max-w-2xl bg-white rounded-md shadow-md overflow-hidden border border-border flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-border">
          <Search className="w-5 h-5 text-text-muted mr-3" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-lg text-text-primary placeholder:text-text-muted"
            placeholder="Search across the platform (Ctrl+K)..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            role="combobox"
            aria-expanded={isOpen}
            aria-controls="command-palette-results"
            aria-activedescendant={filteredItems.length > 0 ? `command-item-${filteredItems[selectedIndex].id}` : undefined}
          />
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-surface rounded-md text-text-muted hover:text-text-primary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto p-2" id="command-palette-results" role="listbox">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-text-secondary" role="option" aria-selected="false">
              No results found for "{query}"
            </div>
          ) : (
            <div className="space-y-1">
              {filteredItems.map((item, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <button
                    key={item.id}
                    id={`command-item-${item.id}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                      isSelected ? 'bg-brand-primary/10 text-brand-primary' : 'hover:bg-surface text-text-primary'
                    }`}
                  >
                    <div className={`mr-3 ${isSelected ? 'text-brand-primary' : 'text-text-muted'}`}>
                      {item.icon ? cloneElement(item.icon as ReactElement<any>, { className: 'w-5 h-5' }) : <Search className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-xs text-text-muted capitalize">{item.type}</div>
                    </div>
                    {isSelected && <ArrowRight className="w-4 h-4 ml-3" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        
        <div className="px-4 py-3 bg-surface border-t border-border flex items-center justify-between text-xs text-text-muted">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><kbd className="bg-white border border-border px-1.5 py-0.5 rounded text-[10px] font-sans">↑</kbd> <kbd className="bg-white border border-border px-1.5 py-0.5 rounded text-[10px] font-sans">↓</kbd> to navigate</span>
            <span className="flex items-center gap-1"><kbd className="bg-white border border-border px-1.5 py-0.5 rounded text-[10px] font-sans">Enter</kbd> to select</span>
          </div>
          <span className="flex items-center gap-1"><kbd className="bg-white border border-border px-1.5 py-0.5 rounded text-[10px] font-sans">ESC</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}
