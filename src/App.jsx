import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NewClient from "./components/input/NewClient";
import Neworder from "./components/input/orderInput/Neworder";
import "./App.css";
import Navigation from "./components/navigation/Navigation";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navigation />,
    },
    {
      path: "/client",
      element: <NewClient />,
    },
    {
      path: "/client/:id", // mise en place du params pour permettre de passer des données via le lien
      element: <NewClient />,
    },
    {
      path: "/neworder",
      element: <Neworder />,
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
