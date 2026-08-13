import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
}) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay background with smooth blur fade */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-200 ease-out animate-fade-in"
      />

      {/* Modal dialog box (Starts from scale(0.95) + opacity: 0, never scale(0)) */}
      <div
        className={cn(
          'relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 overflow-hidden z-10 animate-scale-in transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
          {title ? (
            <h3 className="text-lg font-extrabold text-gray-900 leading-none">{title}</h3>
          ) : (
            <div />
          )}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 p-1.5 rounded-xl hover:bg-gray-100 transition-colors active:scale-95 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>
  );
};

