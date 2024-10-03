import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Provider } from 'react-redux';
import store from './store/store.js';

import Modal from 'react-modal';

// Defina o app element como a div que contém sua aplicação React.
// Se estiver usando 'create-react-app', o id é geralmente 'root'.
Modal.setAppElement('#root');

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <App />
    </Provider>
)
