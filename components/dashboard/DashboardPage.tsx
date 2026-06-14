type DashboardPageHeaderProps = {
  title: string;
  description?: string;
};

export function DashboardPageHeader({ title, description }: DashboardPageHeaderProps) {
  return (
    <header className="border-b border-[#dce8eb] bg-white px-6 py-5 sm:px-8">
      <h1 className="m-0 text-xl font-bold text-primary-dark sm:text-2xl">{title}</h1>
      {description ? <p className="mt-1 mb-0 text-sm text-[#667]">{description}</p> : null}
    </header>
  );
}

export function DashboardWorkspace({ children }: { children: React.ReactNode }) {
  return <main className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">{children}</main>;
}
