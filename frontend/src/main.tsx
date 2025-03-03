import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className='w-full h-[100vh] bg-black'>
    <App />
    </div>
  </React.StrictMode>,
)
