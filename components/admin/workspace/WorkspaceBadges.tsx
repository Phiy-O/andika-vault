export function WorkspaceStatusBadge({ visible }: { visible: boolean }) {
  return (
    <span
      className={`inline-flex h-5 items-center gap-1.5 border border-line px-2 font-jet text-[9px] font-bold uppercase leading-none tracking-[.08em] ${
        visible ? "bg-admin-mint text-foreground" : "bg-admin-wash text-muted"
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${
          visible ? "bg-admin-success" : "bg-muted"
        }`}
        aria-hidden="true"
      />
      {visible ? "Published" : "Draft"}
    </span>
  );
}

export function WorkspaceTextBadge({
  label,
  title,
  className = "",
}: {
  label: string;
  title?: string;
  className?: string;
}) {
  return (
    <span
      title={title ?? label}
      className={`inline-flex max-w-[104px] items-center border border-line bg-surface px-2 py-1 font-jet text-[8px] font-bold uppercase leading-[1.35] tracking-[.05em] text-foreground ${className}`}
    >
      <span className="break-words">{label}</span>
    </span>
  );
}

export function WorkspaceFlagBadge({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex h-5 items-center gap-1.5 border border-line px-2 font-jet text-[9px] font-bold uppercase leading-none tracking-[.08em] ${
        active ? "bg-admin-mint text-foreground" : "bg-admin-wash text-muted"
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${
          active ? "bg-admin-success" : "bg-muted"
        }`}
        aria-hidden="true"
      />
      {children}
    </span>
  );
}
