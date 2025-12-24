import { createBrowserRouter } from 'react-router-dom';
import routers from './routers';

export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter(routers);