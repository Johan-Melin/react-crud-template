import { Outlet } from "@tanstack/react-router";

export function RootLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Outlet />
    </div>
  );
}
