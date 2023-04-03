import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import fire from "./config/fire";
import logo from "./heart.png";
import "./index.css";
import { AuthContext } from "./AuthContext";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    uppercase: false,
    lowercase: false,
    digit: false,
    specialChar: false,
  });
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });

    if (event.target.name === "password" && !isLogin) {
      setPasswordRequirements({
        minLength: event.target.value.length >= 6,
        uppercase: /[A-Z]/.test(event.target.value),
        lowercase: /[a-z]/.test(event.target.value),
        digit: /\d/.test(event.target.value),
        specialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(
          event.target.value
        ),
      });
    }
  };

  const handleSignup = async () => {
    const { email, password } = formData;
    try {
      const { user } = await fire
        .auth()
        .createUserWithEmailAndPassword(email, password);
      setError("Unable to create new user");
      setUser(user); // setting the user in AuthContext...
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { email, password } = formData;

    if (isLogin) {
      fire
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(({ user }) => {
          setError("user cannot be signed in at this time");
          setUser(user); 
          navigate("/dashboard");
        })
        .catch((error) => {
          if (error.code === "auth/user-not-found") {
            return;
          }
        });
    } else {
      const passwordRegex =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,}$/;

      if (!passwordRegex.test(password)) {
        setError(
          "Password must be at least 6 characters long, include one uppercase letter, one lowercase letter, one digit, and one special character"
        );
        return;
      }

      if (!email.includes("@")) {
        setError('Email must include "@"');
        return;
      }

      fire
        .auth()
        .fetchSignInMethodsForEmail(email)
        .then((signInMethods) => {
          if (signInMethods.length > 0) {
            setError("Email is already in use");
          } else {
            handleSignup();
          }
        })
        .catch((error) => {
          setError(error.message);
        });
    }

    if (!isLogin) {
      fire
        .auth()
        .sendPasswordResetEmail(email)
        .then(() => {
          // Password reset email sent successfully
          setError("email was not found try again");
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  };

  return (
    <div className="container">
      <div className="box">
        <h1>{isLogin ? "Login" : "Sign Up"}</h1>
        <div className="avatar-container">
          <div className="imgcontainer">
            <img src={logo} alt="Avatar" className="avatar" />
          </div>
        </div>
        <form onSubmit={handleSubmit} data-testid="login-form">
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {!isLogin && (
            <div>
              <p>Password requirements:</p>
              <ul>
                <li
                  style={{
                    color: passwordRequirements.minLength ? "green" : "red",
                  }}
                >
                  At least 6 characters long
                </li>
                <li
                  style={{
                    color: passwordRequirements.uppercase ? "green" : "red",
                  }}
                >
                  At least one uppercase letter
                </li>
                <li
                  style={{
                    color: passwordRequirements.lowercase ? "green" : "red",
                  }}
                >
                  At least one lowercase letter
                </li>
                <li
                  style={{
                    color: passwordRequirements.digit ? "green" : "red",
                  }}
                >
                  At least one digit
                </li>
                <li
                  style={{
                    color: passwordRequirements.specialChar
                      ? "yellow"
                      : "black",
                  }}
                >
                  At least one special character
                </li>
              </ul>
            </div>
          )}
          {error && <div>{error}</div>}
          <button type="submit" data-testid="submit-btn">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <div className="choicebutton">
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Create new account" : "Already have an account?"}
          </button>
          <button
            onClick={() => {
              fire
                .auth()
                .sendPasswordResetEmail(formData.email)
                .then(() => {
                  setError(
                    `Password reset email has been sent to ${formData.email}`
                  );
                })
                .catch((error) => {
                  setError(error.message);
                });
            }}
          >
            Forgot Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
