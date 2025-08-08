import React, { createContext, useContext, useState } from 'react';

const LoginModalContext = createContext();

export const useLoginModal = () => {
  const context = useContext(LoginModalContext);
  if (!context) {
    throw new Error('useLoginModal must be used within a LoginModalProvider');
  }
  return context;
};

export const LoginModalProvider = ({ children }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [postLoginAction, setPostLoginAction] = useState(null);

  const openLoginModal = (onSuccessCallback = null) => {
    setIsLoginModalOpen(true);
    setPostLoginAction(onSuccessCallback);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setPostLoginAction(null);
  };

  const executePostLoginAction = () => {
    if (postLoginAction) {
      postLoginAction();
      setPostLoginAction(null);
    }
  };

  const value = {
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
    executePostLoginAction,
    postLoginAction
  };

  return (
    <LoginModalContext.Provider value={value}>
      {children}
    </LoginModalContext.Provider>
  );
};
