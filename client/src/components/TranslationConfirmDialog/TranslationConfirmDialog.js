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
    <div className={`translate-confirm-overlay ${isOpen ? 'open' : ''} notranslate`}>
      <div className="translate-confirm-dialog notranslate">
        <div className="translate-confirm-header notranslate">
          <h3 className="notranslate">
            {pendingTranslation?.isEnglish ? 'Switch to English' : `🌐 Translate to ${pendingTranslation?.languageName}`}
          </h3>
        </div>
        
        <div className="translate-confirm-body notranslate">
          <p className="notranslate">
            {pendingTranslation?.isEnglish 
              ? 'This will reload the page and remove all translations, returning to the original English content.'
              : `This will reload the page and translate the content to ${pendingTranslation?.languageName}.`
            }
          </p>
        </div>
        
        <div className="translate-confirm-actions notranslate">
          <button 
            className="translate-confirm-btn cancel notranslate"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            className="translate-confirm-btn confirm notranslate"
            onClick={() => onConfirm(true)}
          >
            {pendingTranslation?.isEnglish ? 'Switch to English' : 'Translate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TranslationConfirmDialog;
