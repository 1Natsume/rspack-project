import React, { useEffect, ReactNode } from 'react';
import './index.css';

export type ModalSize = 'small' | 'medium' | 'large' | 'full';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: ModalSize;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  showBackdrop?: boolean;
  className?: string;
  animation?: 'fade' | 'slide' | 'zoom';
  preventScroll?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true,
  closeOnOverlayClick = true,
  showBackdrop = true,
  className = '',
  animation = 'fade',
  preventScroll = true,
}) => {
  // 阻止背景滚动
  useEffect(() => {
    if (preventScroll && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, preventScroll]);

  // ESC 键关闭
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const sizeClasses = {
    small: 'modal-small',
    medium: 'modal-medium',
    large: 'modal-large',
    full: 'modal-full',
  };

  return (
    <div className={`modal-overlay ${showBackdrop ? 'modal-backdrop' : ''}`} onClick={handleOverlayClick}>
      <div 
        className={`modal-container ${sizeClasses[size]} ${className} modal-animation-${animation}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {title && (
          <div className="modal-header">
            <h2 id="modal-title" className="modal-title">{title}</h2>
            {showCloseButton && (
              <button
                className="modal-close-btn"
                onClick={onClose}
                aria-label="关闭弹窗"
              >
                ×
              </button>
            )}
          </div>
        )}
        
        {!title && showCloseButton && (
          <button
            className="modal-close-btn modal-close-btn-top-right"
            onClick={onClose}
            aria-label="关闭弹窗"
          >
            ×
          </button>
        )}

        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;