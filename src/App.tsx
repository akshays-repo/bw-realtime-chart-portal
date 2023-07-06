import Stats from './views/stats';
import Fft from './views/fft';
import { ToastContainer } from 'react-toastify';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Stats />,
    },
    {
      path: '/sst',
      element: <Stats />,
    },
    {
      path: '/fft',
      element: <Fft />,
    },
  ]);

  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
