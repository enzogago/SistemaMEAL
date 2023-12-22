import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import AuthState from './context/AuthState.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthState>
      <App />
    </AuthState>
  </React.StrictMode>,
)
