import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import "./index.css"; // or "./styles.css" depending on what you're using
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext.jsx';


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>

<GoogleOAuthProvider clientId="886860706228-us2fllgst0f4pdicko6bkhng591gsbbj.apps.googleusercontent.com">
  <AuthProvider>
    <App />
  </AuthProvider>
</GoogleOAuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);
