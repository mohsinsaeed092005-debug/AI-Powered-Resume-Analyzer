import AppSidebar from "@/components/AppSidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#050912]">
      <AppSidebar />
      <main className="ml-56 min-h-screen flex-1">{children}</main>
    </div>
  );
}
