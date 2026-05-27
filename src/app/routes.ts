import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import { About } from "./components/About";
import { Locator } from "./components/Locator";
import Observatorio from "../pages/Observatorio";
import Post from "../pages/Post";
import AdminDashboard from "../pages/AdminDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "sobre", Component: About },
      { path: "localizador", Component: Locator },
      { path: "observatorio", Component: Observatorio },
      { path: "observatorio/:id", Component: Post },
      { path: "cadastro-oculto-gt", Component: AdminDashboard },
    ],
  },
]);
