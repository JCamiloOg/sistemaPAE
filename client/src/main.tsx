import { createRoot } from 'react-dom/client';
import '@/style/index.css';
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { router } from '@/app/routes/Routes';
import { LoaderProvider } from './app/providers/LoaderProvider';
import UserProvider from './app/providers/UserProvider';
import AxiosInterceptorSetup from './app/api/AxiosInterceptorSetup';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <AxiosInterceptorSetup />
      <LoaderProvider>
        <RouterProvider router={router} />
      </LoaderProvider>
    </UserProvider>
  </StrictMode>
);
