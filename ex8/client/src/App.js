import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);

  // check if user is already logged in (e.g. token in localStorage)
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

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setToken(null);
    console.log("User logged out");
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>E-biznes ex8</h1>
        {currentUser ? (
          <div>
            <p>Welcome, {currentUser.username}!</p>
            <p><small>Your token (first 15 chars): {token ? token.substring(0,15) + "..." : "N/A"}</small></p>
            <button onClick={handleLogout}>Logout</button>
            {/* show content for logged-in users? */}
          </div>
        ) : (
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        )}
      </header>
    </div>
  );
}

export default App;