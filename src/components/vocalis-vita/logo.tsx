import { FlaskConical } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <FlaskConical className="h-6 w-6 text-primary" />
      <h1 className="text-xl font-semibold text-foreground">Vocalis Vita</h1>
    </div>
  );
}
