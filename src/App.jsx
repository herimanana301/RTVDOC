import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Newinput from "./components/input/Newinput";
import "./App.css";
import Navigation from "./components/navigation/Navigation";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navigation />,
    },
    {
      path: "/creer",
      element: <Newinput />,
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
