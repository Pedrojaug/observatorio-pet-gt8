import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App' // Aponta para o arquivo que aparece no seu print
import './styles/index.css' // Importa seus estilos globais

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)