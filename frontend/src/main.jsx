import React from 'react'
import UserProvider from './context/UserContext.jsx'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
)

serviceWorkerRegistration.register();
