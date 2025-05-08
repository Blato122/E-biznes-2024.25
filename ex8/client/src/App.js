import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [showLogin, setShowLogin] = useState(true);

  // check if user is already logged in
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setCurrentUser(JSON.parse(storedUser));
      console.log("User loaded from localStorage:", JSON.parse(storedUser));
    }
  }, []);

  const handleLoginSuccess = (userData, authToken) => {
    setCurrentUser(userData);
    setToken(authToken);
    console.log("Logged in as:", userData.username);
  };

  const handleRegistrationSuccess = (username) => {
    console.log("Registered successfully:", username);
    // switch to login form after successful registration so that the user can log in
    setShowLogin(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setToken(null);
    setShowLogin(true); // show login form after logout
    console.log("User logged out");
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>E-biznes App</h1>
        {currentUser ? (
          <div>
            <p>Welcome, {currentUser.username}!</p>
            <p><small>Your token (first 15 chars): {token ? token.substring(0,15) + "..." : "N/A"}</small></p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          // if not logged in, show either Login or Registration form
          showLogin ? (
            <>
              <LoginForm onLoginSuccess={handleLoginSuccess} />
              <p>
                No account?{' '}
                <button
                  onClick={() => setShowLogin(false)}
                  style={{background: 'none', border: 'none', color: 'lightblue', cursor: 'pointer', padding: 0, fontSize: 'inherit', textDecoration: 'underline'}}
                >
                  Register here
                </button>
              </p>
            </>
          ) : (
            <>
              <RegistrationForm onRegistrationSuccess={handleRegistrationSuccess} />
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => setShowLogin(true)}
                  style={{background: 'none', border: 'none', color: 'lightblue', cursor: 'pointer', padding: 0, fontSize: 'inherit', textDecoration: 'underline'}}
                >
                  Login here
                </button>
              </p>
            </>
          )
        )}
      </header>
    </div>
  );
}

export default App;