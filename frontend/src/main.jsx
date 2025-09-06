import React from 'react'
import UserProvider from './context/UserContext.jsx'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
        <GoogleOAuthProvider clientId="742704150829-jinefqh3ir18595t2srtfa8s35s7uh80.apps.googleusercontent.com">
          <App />
        </GoogleOAuthProvider>
    </UserProvider>
  </React.StrictMode>
)

serviceWorkerRegistration.register();
