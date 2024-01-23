import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NewClient from "./components/input/NewClient";
import Neworder from "./components/input/orderInput/Neworder";
import NewPersonal from "./components/personal/handle";
import "./App.css";
import Navigation from "./components/navigation/Navigation";
import { useEffect } from "react";
import MajConge from "./services/majConge";
import FactureContent from "./components/facture/FactureContent";
import Bookingdisplay from "./components/display/bookingdisplay/Bookingdisplay";

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
    {
      path: "/personal",
      element: <NewPersonal />,
    },
    {
      path: "/personal/:id",
      element: <NewPersonal />,
    },
    {
      path: "/facture",
      element: <FactureContent />,
    },
    {
      path: "/station",
      element: <Bookingdisplay />,
    },
  ]);

  /************* Mise à jour des jour de congé *************/

  /********************************************************/

  return (
    <>
      <RouterProvider router={router} />
      <MajConge />
    </>
  );
}

export default App;
