import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import LoginPage, { handleSignup } from "./LoginPage"; 
import { AuthContext } from "./AuthContext";

jest.mock("./config/fire", () => ({
  auth: jest.fn(() => ({
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
  })),
}));

const customRender = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <AuthContext.Provider {...providerProps}>{ui}</AuthContext.Provider>,
    renderOptions
  );
};

test("renders the login page", () => {
  const setUser = jest.fn();
  customRender(
    <Router>
      <LoginPage />
    </Router>,
    { providerProps: { value: { setUser } } }
  );

  // Check heading
  const headingElement = screen.getByRole("heading", {
    level: 1,
    name: /login/i,
  });
  expect(headingElement).toBeInTheDocument();

  // Check email input field
  const emailInput = screen.getByLabelText(/email/i);
  expect(emailInput).toBeInTheDocument();

  // Check password input field
  const passwordInput = screen.getByLabelText(/password/i);
  expect(passwordInput).toBeInTheDocument();

  // Check login button
  const loginButton = screen.getByRole("button", { name: /login/i });
  expect(loginButton).toBeInTheDocument();

  // Check create new account button
  const createAccountButton = screen.getByRole("button", {
    name: /create new account/i,
  });
  expect(createAccountButton).toBeInTheDocument();

  // Check forgot password button
  const forgotPasswordButton = screen.getByRole("button", {
    name: /forgot password/i,
  });
  expect(forgotPasswordButton).toBeInTheDocument();
});
