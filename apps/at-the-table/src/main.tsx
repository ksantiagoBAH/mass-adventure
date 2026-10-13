import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import {LanguageProvider} from './Language';
import './style.css';
import './lesson.css';
createRoot(document.getElementById('root')!).render(<React.StrictMode><LanguageProvider><App /></LanguageProvider></React.StrictMode>);

import './refinements.css';
