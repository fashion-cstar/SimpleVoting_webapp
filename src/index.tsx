import React from 'react'
import ReactDOM from 'react-dom'
import "./tailwind.output.css"
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import {  
  ProcessingProvider
} from 'contexts'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>      
        <ProcessingProvider>          
            <App />          
        </ProcessingProvider>      
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
