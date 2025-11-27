import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'; // NEW: For routing
import { AuthProvider } from './context/AuthContext.jsx'; // NEW: AuthProvider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Wrap the application in the BrowserRouter for client-side routing */}
    <BrowserRouter>
      {/* Wrap the application in the AuthProvider to give all components access to user state */}
      <AuthProvider> 
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)