import Image from 'next/image';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-20 w-20 mr-2">
        <Image src="/logo.jpg" alt="Health Analysis Logo" fill className="object-contain" />
      </div>
      <h1 className="text-3xl font-bold text-foreground">Disease prediction using face and voice analysis</h1>
    </div>
  );
}
