import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeModeProvider } from './theme/ThemeModeContext'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="748745962552-pm8h5es14e5krr19m07v0dnbnvqukf6k.apps.googleusercontent.com">
      <ThemeModeProvider>
        <App />
      </ThemeModeProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)