import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isDismissed, setIsDismissed] = useState(
    localStorage.getItem('mr_institute_install_dismissed') === 'true'
  );

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('mr_institute_install_dismissed', 'true');
  };

  if (!deferredPrompt || isDismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 z-50 animate-in slide-in-from-bottom-5">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
          <img src="/pwa-192x192.png" alt="Logo" className="w-8 h-8 rounded-md" onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">Install MR Institute</h3>
          <p className="text-sm text-gray-500 mt-1">
            Install our app for faster access, offline support, and push notifications.
          </p>
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={handleInstallClick}
              className="flex-1 bg-primary text-white text-sm font-medium py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Dismiss"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
