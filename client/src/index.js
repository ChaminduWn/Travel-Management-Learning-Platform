import React from "react";
import ReactDOM from "react-dom";
import { createGlobalStyle } from 'styled-components';
import App from "./App";
import { AuthContextProvider } from "./context/authContext";

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Roboto', sans-serif;
  }
`;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
      <AuthContextProvider>
        <GlobalStyle />
        <App />
      </AuthContextProvider>
  </React.StrictMode>
);
