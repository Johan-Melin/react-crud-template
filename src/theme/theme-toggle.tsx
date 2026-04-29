import type { ThemeMode } from "./theme-context.ts";
import { useTheme } from "./use-theme.ts";

const themeOptions: Array<{ label: string; value: ThemeMode }> = [
  { label: "System", value: "system" },
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
];

export function ThemeToggle() {
  const { mode, setMode } = useTheme();

  return (
    <div
      className="inline-flex rounded-full border border-app-border bg-white/55 p-1 shadow-sm dark:bg-white/5"
      role="group"
      aria-label="Theme mode"
    >
      {themeOptions.map((option) => {
        const isActive = option.value === mode;

        return (
          <button
            key={option.value}
            type="button"
            className={[
              "rounded-full px-3 py-2 text-xs font-semibold tracking-[0.2em] uppercase transition sm:px-4",
              isActive
                ? "bg-app-accent text-app-accent-foreground"
                : "text-app-muted hover:text-app-text",
            ].join(" ")}
            onClick={() => setMode(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
