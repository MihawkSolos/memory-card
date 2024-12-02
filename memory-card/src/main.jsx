import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Fetch } from './components/Fetch.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Fetch />
  </StrictMode>,
)
