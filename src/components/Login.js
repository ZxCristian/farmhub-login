import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // This should remain as is since App.css is in src/ and Login.js is in src/components/

function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="App">
      <div className="login-container">
        <h1 className="title">FarmHub</h1>
        <p className="subtitle">"Connecting farmers to success"</p>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email:</label>
            <input type="email" placeholder="Email" required />
          </div>
          <div className="input-group">
            <label>Password:</label>
            <input type="password" placeholder="Password" required />
            <a href="#" className="forgot-password">forgot your password?</a>
          </div>
          <button type="submit" className="sign-in-btn">Sign in</button>
        </form>
      </div>
    </div>
  );
}

export default Login;