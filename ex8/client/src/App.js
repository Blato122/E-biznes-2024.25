import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [showLogin, setShowLogin] = useState(true);

  // check if user is already logged in
  useEffect(() => {
    const fetchUserInfoFromCookie = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/auth/me', {
          credentials: 'include', // Include cookies in the request
        });

        if (response.ok) {
          const data = await response.json();
          setCurrentUser(data.user);
          setToken('Cookie-based'); // indicate that the token is from a cookie
          console.log("User logged in via cookie:", data.user);
        }
      } catch (error) {
        console.error("Error fetching user info from cookie:", error);
      }
    };

    // check if there are query parameters in the URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const user = params.get('user');

    if (token && user) {
      const parsedUser = JSON.parse(decodeURIComponent(user));
      setCurrentUser(parsedUser);
      setToken(token);
      window.history.replaceState({}, document.title, '/');
    } else {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setCurrentUser(JSON.parse(storedUser));
        console.log("User loaded from localStorage:", JSON.parse(storedUser));
      } else {
        // attempt cookie-based login if no token or localStorage data is found
        fetchUserInfoFromCookie();
      }
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
    fetch('http://localhost:3001/api/auth/logout', { method: 'POST', credentials: 'include' });
  };

  const GoogleSignInButton = () => {
    const handleGoogleSignIn = () => {
      // Redirect to the Google Sign-In URL
      window.location.href = 'http://localhost:3001/api/auth/google';
    };
  
    return (
      <button onClick={handleGoogleSignIn} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Sign in with Google
      </button>
    );
  };

  const GitHubSignInButton = () => {
    const handleGitHubSignIn = () => {
        window.location.href = 'http://localhost:3001/api/auth/github';
    };

    return (
        <button onClick={handleGitHubSignIn} style={{ padding: '10px 20px', fontSize: '16px', margin: '10px' }}>
            Sign in with GitHub
        </button>
    );
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
          </div>
        ) : (
          <>
            {/* show login or registration form */}
            {showLogin ? (
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
            )}
  
            {/* Google Sign-In Button */}
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
              <GoogleSignInButton />
              <GitHubSignInButton />
            </div>
          </>
        )}
      </header>
    </div>
  );
}

export default App;