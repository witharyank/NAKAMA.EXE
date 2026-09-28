"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Users, Map, Ship, Anchor } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navigation() {
  const pathname = usePathname();
  if (pathname === '/') return null;
  
  return (
    <nav className="border-b border-[#e6e0d3] bg-[#fdfbf7]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-6 h-24 flex items-center justify-between">
        <Link href="/participants" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-12 h-12 rounded-full border-2 border-[#e6e0d3] bg-[#f5e6c8] text-[#0a192f] flex items-center justify-center relative overflow-hidden">
            <Compass className="w-6 h-6 absolute" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif tracking-widest text-2xl font-black text-[#0a192f]">NAKAMA.EXE</span>
            <span className="text-[9px] font-bold tracking-[0.2em] text-[#0a192f]/60 uppercase">Grand Line Recruitment Engine v2.4</span>
          </div>
        </Link>
        <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold tracking-[0.15em] uppercase text-[#0a192f]">
          <Link href="/participants" className={`transition-colors px-3 py-1.5 rounded ${pathname === '/participants' ? 'bg-[#e0f2f1] text-[#0d5f66]' : 'hover:bg-[#e0f2f1]/50'}`}>
            CREW
          </Link>
          <Link href="/davy-back" className={`transition-colors px-3 py-1.5 rounded ${pathname === '/davy-back' ? 'bg-[#e0f2f1] text-[#0d5f66]' : 'hover:bg-[#e0f2f1]/50'}`}>
            ASSEMBLY
          </Link>
          <Link href="/challenges" className={`transition-colors px-3 py-1.5 rounded ${pathname === '/challenges' ? 'bg-[#e0f2f1] text-[#0d5f66]' : 'hover:bg-[#e0f2f1]/50'}`}>
            GRAND LINE
          </Link>
          <Link href="/fleets" className={`transition-colors px-3 py-1.5 rounded ${pathname === '/fleets' ? 'bg-[#e0f2f1] text-[#0d5f66]' : 'hover:bg-[#e0f2f1]/50'}`}>
            FLEET
          </Link>
          <span className="text-[#0a192f]/40 cursor-not-allowed">LOG POSE</span>
          <span className="text-[#0d5f66] bg-[#e0f2f1] px-3 py-1.5 rounded flex items-center gap-1 cursor-pointer hover:bg-[#cbeae8] transition-colors">
            <span className="text-[8px]">▶</span> LOG POSE SYNC
          </span>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <Button className="bg-[#da2528] hover:bg-[#b71c1c] text-white rounded font-bold tracking-widest uppercase text-[10px] px-6 h-10 shadow-[0_4px_14px_0_rgba(218,37,40,0.39)] transition-transform hover:-translate-y-0.5">
            <Anchor className="w-3.5 h-3.5 mr-2" /> JOIN THE CREW
          </Button>
          <div className="w-10 h-10 rounded bg-[#0d5f66] flex items-center justify-center text-white cursor-pointer hover:bg-[#0a4b52] transition-colors shadow-md">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>
    </nav>
  );
}
