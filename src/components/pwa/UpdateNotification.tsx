// @ts-ignore
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';

export const UpdateNotification = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r: any) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error: any) {
      console.log('SW registration error', error);
    },
  });

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-96 bg-gray-900 text-white rounded-md shadow-md p-4 z-50 animate-in slide-in-from-bottom-5">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="text-sm font-medium">New version available!</p>
          <p className="text-xs text-gray-400 mt-0.5">Click refresh to update.</p>
        </div>
        <button
          onClick={() => updateServiceWorker(true)}
          className="bg-brand-primary hover:bg-brand-primary-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
        <button
          onClick={() => setNeedRefresh(false)}
          className="text-gray-400 hover:text-white transition-colors p-1"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};
