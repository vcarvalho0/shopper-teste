import { createBrowserRouter } from 'react-router-dom'
import Home from '../pages/Home'
import Ride from '../pages/Ride'
import RideHistory from '../pages/RideHistory'

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/ride", element: <Ride /> },
  { path: "/ride/history", element: <RideHistory /> }
])