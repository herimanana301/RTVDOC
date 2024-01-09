import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NewClient from "./components/input/NewClient";
import Neworder from "./components/input/orderInput/Neworder";
import NewPersonal from "./components/personal/handle";
import "./App.css";
import Navigation from "./components/navigation/Navigation";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navigation />,
    },
    {
      path: "/newclient",
      element: <NewClient />,
    },
    {
      path: "/neworder",
      element: <Neworder />,
    },
    {
      path: "/newpersonal",
      element: <NewPersonal />,
    },
    
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
