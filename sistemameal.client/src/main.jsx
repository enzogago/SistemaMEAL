import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import AuthState from './context/AuthState.jsx'
import StatusState from './context/StatusState.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthState>
      <StatusState>
        <App />
        <div
            className='flex ai-center jc-center'
            style={{
                position: 'absolute',
                right: '20%',
                left: '20%',
                top: '0'
            }}
        >
            <h3
                className='p_5 Medium-f1_5 Small-f1'
                style={{
                    backgroundColor: '#000000',
                    color: '#FFFFFF'
                }}
            >
                Modo Simulador
            </h3>
        </div>
      </StatusState>
    </AuthState>,
)
