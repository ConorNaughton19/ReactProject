import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import fire from "./config/fire";
import logo from "./heart.png";


const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleLogin = (event) => {
    event.preventDefault();
    const { email, password } = formData;

    fire.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        setError('');
        navigate('/dashboard');
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleSignup = (event) => {
    event.preventDefault();
    const { email, password } = formData;

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!email.includes('@')) {
      setError('Email must include "@"');
      return;
    }

    fire.auth().createUserWithEmailAndPassword(email, password)
      .then(() => {
        setError('');
        navigate('/dashboard');
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <div className="container">
    <div className="box">
      <h1>Login or Sign Up</h1>
      <div className="avatar-container">
      <div className="imgcontainer">
        <img src={logo} alt="Avatar" className="avatar" />
      </div>
      </div>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        {error && <div>{error}</div>}
        <button type="submit">Login</button>
      </form>
      <form onSubmit={handleSignup}>
        <div>
          <label htmlFor="signup-email">Email:</label>
          <input type="email" id="signup-email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="signup-password">Password:</label>
          <input type="password" id="signup-password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        {error && <div>{error}</div>}
        <button type="submit">Sign Up</button>
      </form>
    </div>
    </div>
  );
};

export default LoginPage;
