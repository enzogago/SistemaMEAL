import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import AuthState from './context/AuthState.jsx'
import StatusState from './context/StatusState.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthState>
      <StatusState>
        <App />
      </StatusState>
    </AuthState>
  </React.StrictMode>,
)
