type DashboardPageHeaderProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function DashboardPageHeader({ title, description, action }: DashboardPageHeaderProps) {
  return (
    <header className="shrink-0 border-b border-[#dce8eb] bg-white px-6 py-5 sm:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="m-0 text-xl font-bold text-primary-dark sm:text-2xl">{title}</h1>
          {description ? <p className="mt-1 mb-0 text-sm text-[#667]">{description}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </header>
  );
}

export function DashboardWorkspace({ children }: { children: React.ReactNode }) {
  return <main className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">{children}</main>;
}
