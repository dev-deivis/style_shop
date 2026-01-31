import AccountSidebar from '@/components/account/AccountSidebar';

export default function MiCuentaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#f7f6f8] dark:bg-[#111121]">
      <div className="flex flex-1 w-full max-w-[1440px] mx-auto">
        {/* Sidebar fijo */}
        <AccountSidebar />
        
        {/* Contenido dinámico */}
        <main className="flex-1 px-6 py-8 md:px-12 md:py-12 lg:px-20 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
