import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Validate environment variables
import { validateEnvironment } from './utils/envValidation';
validateEnvironment();

// Initialize Google Analytics early
import { initGA } from './services/analytics';
initGA();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

