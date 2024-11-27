import { RouterProvider } from 'react-router-dom'
import { APIProvider } from "@vis.gl/react-google-maps"
import { router } from './routes'
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_API_KEY}>
      <RouterProvider router={router} />
    </APIProvider>
  )
}

export default App
