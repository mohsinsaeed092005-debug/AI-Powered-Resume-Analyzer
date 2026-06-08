import AppSidebar from "@/components/AppSidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050912]">
      <AppSidebar />
      <main className="min-h-screen px-4 py-5 pb-24 sm:px-6 lg:ml-56 lg:px-8 lg:py-8 lg:pb-8">
        {children}
      </main>
    </div>
  );
}
