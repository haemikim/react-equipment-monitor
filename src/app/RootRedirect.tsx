import { Navigate } from "react-router-dom";

// 단말기 종류 확인 (Mobile / PC)
export default function RootRedirect() {
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  return <Navigate to={isMobile ? "/m" : "/admin"} replace />;
}
