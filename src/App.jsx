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
      path: "/newclient",
      element: <NewClient />,
    },
    {
      path: "/neworder",
      element: <Neworder />,
    },
    {
    path: "/newinvoice",
      element: <Neworder />,
    }

  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
