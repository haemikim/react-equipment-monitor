import { useNavigate } from "react-router-dom";

import { Outlet } from "react-router";

import { Button } from "@/components/ui/button";
import { Forklift } from "lucide-react";

export default function GlobalLayout() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-white px-8">
        <div className="flex items-center gap-3">
          <div
            onClick={() => navigate("/")}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-500 cursor-pointer"
          >
            <Forklift className="h-5 w-5 text-white" />
          </div>

          <span className="text-[17px] font-bold text-slate-900">
            Equipment Monitor
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500">김이박</span>

          {/* 추후 기능 추가 */}
          <Button className="text-sm font-medium text-slate-200 hover:text-slate-100">
            로그아웃
          </Button>
        </div>
      </header>
      <main className="min-h-screen bg-[#F2F4F6]">
        <div className="mx-auto max-w-[1600px] space-y-6 px-8 py-8">
          <Outlet />
        </div>
      </main>
      {/* <footer className="text-muted-foreground border-t py-1 text-center">

      </footer> */}
    </div>
  );
}
