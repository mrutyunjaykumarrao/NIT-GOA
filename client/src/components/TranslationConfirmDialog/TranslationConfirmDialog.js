import React from 'react';
import './TranslationConfirmDialog.css';

const TranslationConfirmDialog = ({
  isOpen,
  pendingTranslation,
  onConfirm,
  onCancel
}) => {
  if (!isOpen || !pendingTranslation) return null;

  return (
    <div className="translate-confirm-overlay">
      <div className="translate-confirm-dialog">
        <div className="translate-confirm-header">
          <h3>
            <span>🌐</span>
            Translate Page
          </h3>
        </div>
        
        <div className="translate-confirm-body">
          <p>
            {pendingTranslation.isEnglish 
              ? 'This will reload the page and remove all translations, returning to the original English content.'
              : `This will reload the page and translate the content to ${pendingTranslation.languageName}.`
            }
          </p>
        </div>
        
        <div className="translate-confirm-actions">
          <button 
            className="translate-confirm-btn translate-confirm-cancel"
            onClick={() => onConfirm(false)}
          >
            Cancel
          </button>
          <button 
            className="translate-confirm-btn translate-confirm-proceed"
            onClick={() => onConfirm(true)}
          >
            {pendingTranslation.isEnglish ? 'Remove Translation' : 'Translate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TranslationConfirmDialog;
