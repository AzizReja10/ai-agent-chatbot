// src/components/ui/tabs.jsx
import * as React from "react";
import { cn } from "../../lib/utils";

const TabsContext = React.createContext({
  value: "",
  onValueChange: () => {},
});

function Tabs({ value, defaultValue, onValueChange, className, children, ...props }) {
  const [currentValue, setCurrentValue] = React.useState(value ?? defaultValue ?? "");

  React.useEffect(() => {
    if (value !== undefined) {
      setCurrentValue(value);
    }
  }, [value]);

  const handleValueChange = (val) => {
    if (value === undefined) {
      setCurrentValue(val);
    }
    onValueChange?.(val);
  };

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

function TabsList({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-xl bg-zinc-100 p-1 text-zinc-500 dark:bg-zinc-800/80 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-700/40",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function TabsTrigger({ value, className, children, ...props }) {
  const context = React.useContext(TabsContext);
  const isSelected = context.value === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isSelected}
      onClick={() => context.onValueChange(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium ring-offset-white transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        isSelected
          ? "bg-white text-zinc-950 shadow-sm dark:bg-zinc-900 dark:text-zinc-50 font-semibold"
          : "hover:text-zinc-900 dark:hover:text-zinc-100",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function TabsContent({ value, className, children, ...props }) {
  const context = React.useContext(TabsContext);
  if (context.value !== value) return null;

  return (
    <div
      role="tabpanel"
      className={cn(
        "mt-3 ring-offset-white focus-visible:outline-none animate-in fade-in-50 duration-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };

