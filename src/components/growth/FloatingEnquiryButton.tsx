import { MessageCircle, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';

export const FloatingEnquiryButton = () => {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      {/* WhatsApp Button */}
      <a
        href="https://wa.me/1234567890" // Placeholder number
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 bg-success text-white rounded-full flex items-center justify-center shadow-sm hover:bg-success transition-colors animate-in slide-in-from-bottom-2 fade-in duration-500"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={24} />
      </a>
      
      {/* Quick Enquiry Button */}
      <Link
        to={ROUTES.PUBLIC.CONTACT}
        className="w-12 h-12 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-sm hover:bg-brand-primary-hover transition-colors animate-in slide-in-from-bottom-2 fade-in duration-700"
        aria-label="Enquire Now"
      >
        <FileText size={24} />
      </Link>
    </div>
  );
};
