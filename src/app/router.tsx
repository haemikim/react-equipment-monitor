import { createBrowserRouter } from "react-router-dom";

import WebLayout from "@/components/layouts/WebLayout";
// import MobileLayout from "@/layouts/MobileLayout";
import RootRedirect from "./RootRedirect";

import MainPage from "@/pages/web/MainPage/MainPage";
// import MapPage from "@/pages/admin/MapPage";
// import UsersPage from "@/pages/admin/UsersPage";
import NotFoundPage from "@/components/common/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirect />,
  },
  // {
  //   path: "/login",
  // element: <LoginPage />,
  // },
  {
    path: "/admin",
    element: <WebLayout />,
    children: [
      { index: true, element: <MainPage /> },
      // { path: "map", element: <MapPage /> },
      // { path: "users", element: <UsersPage /> },
    ],
  },
  // {
  //   path: "/m",
  //   // element: <MobileLayout />,
  //   children: [],
  // },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
