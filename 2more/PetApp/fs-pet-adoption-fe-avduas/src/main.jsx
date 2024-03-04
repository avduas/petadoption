import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css';
import { BrowserRouter as Router } from 'react-router-dom';

const currentRole = 'admin';

ReactDOM.createRoot(document.getElementById('root')).render(
    <Router>
    <App  currentRole={currentRole} />
    </Router>
)
