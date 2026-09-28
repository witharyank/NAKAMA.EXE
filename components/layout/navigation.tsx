import Link from 'next/link';
import { Compass, Users, Map, Ship, Anchor } from 'lucide-react';

export function Navigation() {
  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
          <Anchor className="w-6 h-6" />
          <span>NAKAMA.EXE</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/participants" className="flex items-center gap-2 hover:text-primary transition-colors text-slate-600">
            <Users className="w-4 h-4" /> Participants
          </Link>
          <Link href="/challenges" className="flex items-center gap-2 hover:text-primary transition-colors text-slate-600">
            <Map className="w-4 h-4" /> Challenges
          </Link>
          <Link href="/fleets" className="flex items-center gap-2 hover:text-primary transition-colors text-slate-600">
            <Ship className="w-4 h-4" /> Crews
          </Link>
          <Link href="/davy-back" className="flex items-center gap-2 hover:text-accent transition-colors text-accent">
            <Compass className="w-4 h-4" /> Davy Back
          </Link>
        </div>
      </div>
    </nav>
  );
}
