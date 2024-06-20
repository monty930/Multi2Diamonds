import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './js/Common/AuthContext';
import './index.css';
import Page from './js/Common/Page';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <AuthProvider>
            <Page />
        </AuthProvider>
    </React.StrictMode>
);

reportWebVitals();
