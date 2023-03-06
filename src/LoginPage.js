import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from "./config/fire";
import fire from "./config/fire";
import logo from "./heart.png";
import "./index.css";
import { AuthContext } from "./AuthContext";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSignup = async () => {
    const { email, password } = formData;

    try {
      const { user } = await fire.auth().createUserWithEmailAndPassword(email, password);

      // Create a new database node for the user with mock data
      const userRef = db.ref(`users/${user.uid}`);
      userRef.set({
        MockBarData: [
          { DAY: "Monday", LOW: 10, HEALTHY: 20, HIGH: 30 },
          { DAY: "Tuesday", LOW: 15, HEALTHY: 25, HIGH: 35 },
          { DAY: "Wednesday", LOW: 20, HEALTHY: 30, HIGH: 40 },
          { DAY: "Thursday", LOW: 25, HEALTHY: 35, HIGH: 45 },
          { DAY: "Friday", LOW: 30, HEALTHY: 40, HIGH: 50 },
          { DAY: "Saturday", LOW: 35, HEALTHY: 45, HIGH: 55 },
          { DAY: "Sunday", LOW: 40, HEALTHY: 50, HIGH: 60 },
        ],
        mockAreaBumpData: [
          // ...
        ],
        mockLineData: [
          // ...
        ],
        mockPieData: [
          // ...
        ],
      });

      setError('');
      setUser(user); // set user in the AuthContext
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { email, password } = formData;

    if (isLogin) {
      fire.auth().signInWithEmailAndPassword(email, password)
        .then(({ user }) => {
          setError('');
          setUser(user); // set user in the AuthContext
          navigate('/dashboard');
        })
        .catch((error) => {
          setError(error.message);
        });
    } else {
      if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }

      if (!email.includes('@')) {
        setError('Email must include "@"');
        return;
      }

      fire.auth().fetchSignInMethodsForEmail(email)
        .then((signInMethods) => {
          if (signInMethods.length > 0) {
            setError('Email is already in use');
          } else {
            handleSignup();
          }
        })
        .catch((error) => {
          setError(error.message);
        });
    }

    if (!isLogin) {
      fire.auth().sendPasswordResetEmail(email)
        .then(() => {
          // Password reset email sent successfully
          setError('');
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  };

  return (
    <div className="container">
      <div className="box">
        <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
        <div className="avatar-container">
          <div className="imgcontainer">
            <img src={logo} alt="Avatar" className="avatar" />
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          {error && <div>{error}</div>}
          <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
        </form>
        <div className="choicebutton">
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Create new account' : 'Already have an account?'}
          </button>
          <button onClick={() => {
            fire.auth().sendPasswordResetEmail(formData.email)
              .then(() => {
                setError(`Password reset email has been sent to ${formData.email}`);
              })
              .catch((error) => {
                setError(error.message);
              });
          }}>Forgot Password</button>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;