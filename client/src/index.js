import React from "react";
import ReactDOM from "react-dom/client"; // Correct import for React 18
import { createGlobalStyle } from 'styled-components';
import App from "./App";
import { AuthContextProvider } from "./context/authContext";

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Roboto', sans-serif;
  }
`;

// Create a root element using React 18 API
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the app
root.render(
  <React.StrictMode>
      <AuthContextProvider>
        <GlobalStyle />
        <App />
      </AuthContextProvider>
  </React.StrictMode>
);
