import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home.jsx";
import Usuario from "./pages/Usuario.jsx";
import NovoUsuario from "./pages/NovoUsuario.jsx";
import Animal from "./pages/Animal.jsx";
import NovoAnimal from "./pages/NovoAnimal.jsx";
import NovoHistoricoAdocao from "./pages/NovoHistorico_Adocao.jsx";
import HistoricoAdocao from "./pages/Historico_Adocao.jsx";
import EditarUsuario from "./pages/EditarUsuario.jsx";
// 💡 Importe o novo componente de Login
import Login from "./pages/Login.jsx";
import ProtectedRoutes from "./components/ProtectedRoutes.jsx";

const rotas = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/usuario/novo",
    element: <NovoUsuario />,
  },
  {
    path: "/animal",
    element: <Animal />,
  },
  {
    path: "/",
    element: <ProtectedRoutes />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      // 💡 Adicione a rota de Login
      {
        path: "/usuario",
        element: <Usuario />,
      },
      {
        path: "/animal/novo",
        element: <NovoAnimal />,
      },
      {
        path: "/historico_adocao",
        element: <HistoricoAdocao />,
      },
      {
        path: "/historico_adocao/novo",
        element: <NovoHistoricoAdocao />,
      },
      {
        path: "/usuario/editar/:id",
        element: <EditarUsuario />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={rotas} />
  </StrictMode>
);
