import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';
import '../App.css';
import './CircularFlow.css';
import CircularFlowPage from './CircularFlowPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CircularFlowPage />
  </StrictMode>,
);
