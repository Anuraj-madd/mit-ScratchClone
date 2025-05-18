import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Allcontext from './context/Allcontext.jsx';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Allcontext>
      <App />
    </Allcontext>
  </StrictMode>
);
