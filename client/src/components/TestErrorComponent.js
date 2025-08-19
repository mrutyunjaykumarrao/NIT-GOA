import React, { useState } from 'react';

const TestErrorComponent = () => {
  const [shouldThrowError, setShouldThrowError] = useState(false);

  // Force an error during render
  if (shouldThrowError) {
    // This will definitely trigger the ErrorBoundary
    throw new Error('Test error: This is intentionally thrown to demonstrate ErrorBoundary!');
  }

  const triggerError = () => {
    console.log('Triggering error...');
    setShouldThrowError(true);
  };

  return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center',
      maxWidth: '600px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>Error Boundary Test Page</h2>
      <p style={{ 
        color: '#666', 
        marginBottom: '30px', 
        lineHeight: '1.6',
        fontSize: '16px'
      }}>
        This page is designed to test the ErrorBoundary component. When you click the button below, 
        it will throw an error that should be caught by the ErrorBoundary wrapper.
      </p>
      
      <div style={{ 
        backgroundColor: '#fff3cd', 
        border: '1px solid #ffeaa7', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <p style={{ margin: '0', color: '#856404' }}>
          <strong>Note:</strong> In development mode, React shows its own error overlay first. 
          Close that overlay (click the X) to see the actual ErrorBoundary component.
        </p>
      </div>

      <button 
        onClick={triggerError}
        style={{
          padding: '15px 30px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          transition: 'background-color 0.3s'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
      >
        🔥 Trigger Error to Test ErrorBoundary
      </button>
    </div>
  );
};

export default TestErrorComponent;
