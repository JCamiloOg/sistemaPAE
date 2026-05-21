import { createRoot } from 'react-dom/client';
import '@/style/index.css';
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { router } from '@/app/routes/Routes';
import { LoaderProvider } from './app/providers/LoaderProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LoaderProvider>
      <RouterProvider router={router} />
    </LoaderProvider>
  </StrictMode>
);
