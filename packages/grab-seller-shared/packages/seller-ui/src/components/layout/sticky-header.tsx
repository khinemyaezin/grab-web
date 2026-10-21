import { useScrolled } from "@/hooks/use-scrolled";

export default function StickyHeader({ children }: { children: React.ReactElement }) {
    const isScrolled = useScrolled();

    return (
    <div
      className={`flex items-center justify-between sticky top-0 z-10 transition-all ${
        isScrolled
          ? "pt-6 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shadow-sm"
          : ""
      }`}
    >
      {children}
    </div>
  );
}