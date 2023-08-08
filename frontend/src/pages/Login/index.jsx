import React, { useState } from 'react';

const Login = () => {
  const [auth, setAuth] = useState({
    identifier: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!auth.identifier || !auth.password) {
      setError('Username and password are required.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(auth),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('userData', JSON.stringify(data.user));
        console.log('Login successful');
        if (data.user.level === 0) {
          window.location.href = '/dashboard-admin';
        } else {
          window.location.href = '/dashboard';
        }
      } else {
        setError('Invalid username or password.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while logging in.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="py-12 px-12 bg-white rounded-2xl shadow-xl z-20">
        <div>
          <h1 className="text-3xl font-bold text-center mb-4 cursor-pointer">Login</h1>
          <p className="w-80 text-center text-sm mb-8 font-semibold text-gray-700 tracking-wide cursor-pointer">Log in to your account to access all the services.</p>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            id="identifier"
            name="identifier"
            placeholder="Enter your email or username"
            value={auth.identifier}
            onChange={(e) => setAuth({ ...auth, identifier: e.target.value })}
            className="block w-full py-2 px-4 rounded-lg border focus:outline-none focus:ring focus:border-blue-300"
          />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={auth.password}
            onChange={(e) => setAuth({ ...auth, password: e.target.value })}
            onKeyDown={handleKeyPress}
            className="block w-full py-2 px-4 rounded-lg border focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        <div className="text-center mt-6">
          {loading ? (
            <button disabled className="py-3 w-64 text-xl text-white bg-gray-400 rounded-2xl">
              Logging in...
            </button>
          ) : (
            <button onClick={handleLogin} className="py-3 w-64 text-xl text-white bg-purple-400 rounded-2xl">
              Login
            </button>
          )}
          {/* <p className="mt-4 text-sm">
            Don't have an account? <span className="underline cursor-pointer">Sign Up</span>
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
