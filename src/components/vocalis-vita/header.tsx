import { Logo } from '@/components/vocalis-vita/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { HistorySheet } from './history-sheet';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-24 max-w-full items-center justify-between px-6">
        <Logo />
        <div className="flex items-center gap-2">
          <HistorySheet />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
