"use client";

import { ReactNode, useState, createContext, useContext, useEffect } from "react";

interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  description?: string;
}

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs components must be used within Tabs.Root");
  return ctx;
}

interface TabsRootProps {
  defaultTab: string;
  children: ReactNode;
  onChange?: (tabId: string) => void;
}

export function TabsRoot({ defaultTab, children, onChange }: TabsRootProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleSetActiveTab = (id: string) => {
    setActiveTab(id);
    onChange?.(id);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleSetActiveTab }}>
      <div className="w-full">{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <nav
      role="tablist"
      aria-label="Settings sections"
      className={`flex flex-wrap gap-2 border-b border-line pb-1 ${className ?? ""}`}
    >
      {children}
    </nav>
  );
}

interface TabsTriggerProps {
  tabId: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}

export function TabsTrigger({ tabId, children, className, icon }: TabsTriggerProps) {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === tabId;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${tabId}`}
      id={`tab-${tabId}`}
      onClick={() => setActiveTab(tabId)}
      type="button"
      className={`
        flex items-center gap-2 px-4 py-3 text-sm font-bold border-2 transition-all duration-200
        ${isActive
          ? "border-foreground bg-foreground text-background shadow-[3px_3px_0_var(--line)]"
          : "border-line bg-surface text-foreground hover:border-foreground hover:shadow-[2px_2px_0_var(--foreground)]"
        }
        ${className ?? ""}
      `}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </button>
  );
}

interface TabsContentProps {
  children: ReactNode;
  className?: string;
}

export function TabsContent({ children, className }: TabsContentProps) {
  return (
    <div className={`mt-6 ${className ?? ""}`} role="tabpanel">
      {children}
    </div>
  );
}

interface TabPanelProps {
  tabId: string;
  children: ReactNode;
  className?: string;
}

export function TabPanel({ tabId, children, className }: TabPanelProps) {
  const { activeTab } = useTabsContext();
  if (activeTab !== tabId) return null;

  return (
    <div
      id={`panel-${tabId}`}
      role="tabpanel"
      aria-labelledby={`tab-${tabId}`}
      className={`animate-in fade-in duration-200 ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

// Compound component
TabsRoot.List = TabsList;
TabsRoot.Trigger = TabsTrigger;
TabsRoot.Content = TabsContent;
TabsRoot.Panel = TabPanel;

export { TabsRoot as Tabs };