import React from 'react';
import Modal from '.';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = '确认操作',
  message,
  confirmText = '确认',
  cancelText = '取消',
  variant = 'info',
  isLoading = false,
}) => {
  const variantColors = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    info: 'bg-blue-600 hover:bg-blue-700',
  };

  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="small"
      closeOnOverlayClick={!isLoading}
    >
      <div className="confirm-modal">
        <p className="confirm-message">{message}</p>
        
        <div className="confirm-actions">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="confirm-btn cancel-btn"
          >
            {cancelText}
          </button>
          
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className={`confirm-btn ${variantColors[variant]}`}
          >
            {isLoading ? '处理中...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;