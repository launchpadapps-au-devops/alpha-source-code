import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import './index.css';
import './styles/global.scss';
import { Provider } from 'react-redux';
import { persistor, store } from './app/store';
import { PersistGate } from 'redux-persist/integration/react';
import { UnsavedChangesProvider } from './components/pages/content/lessons/lesson-components/unchanged-warning-hook-context';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
        <UnsavedChangesProvider>
            <App />
        </UnsavedChangesProvider>
        </PersistGate>
        </Provider>
    </React.StrictMode>
);
