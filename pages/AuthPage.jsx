import React, { useState } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';

const AuthPage = ({ onLogin }) => {
  const [isSignIn, setIsSignIn] = useState(true);

  const toggleMode = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <>
      {isSignIn ? (
        <SignIn onToggleMode={toggleMode} onLogin={onLogin} />
      ) : (
        <SignUp onToggleMode={toggleMode} onLogin={onLogin} />
      )}
    </>
  );
};

export default AuthPage;