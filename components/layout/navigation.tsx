"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Users, Map, Ship, Anchor, Target, Bell, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navigation() {
  const pathname = usePathname();
  if (pathname === '/') return null;
  
  return (
    <nav className="border-b border-white/20 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Left: Logo */}
        <Link href="/participants" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-full bg-[#d4af37] border-2 border-[#0a192f] text-[#0a192f] flex items-center justify-center relative overflow-hidden shadow-inner">
             <div className="w-4 h-4 border-2 border-[#0a192f] rounded-full flex items-center justify-center">
               <div className="w-1.5 h-1.5 bg-[#0a192f] rounded-full" />
             </div>
          </div>
          <div className="flex flex-col">
            <span className="font-serif tracking-widest text-xl font-black text-[#0a192f] leading-none mb-1">NAKAMA.EXE</span>
            <span className="text-[9px] font-bold tracking-[0.2em] text-[#d4af37] uppercase leading-none">GRAND LINE LOG</span>
          </div>
        </Link>
        
        {/* Center: Links */}
        <div className="hidden lg:flex items-center gap-10 text-[12px] font-bold tracking-wider text-[#0a192f]">
          <Link href="/participants" className={`transition-colors py-2 border-b-2 ${pathname === '/participants' ? 'border-[#da2528] text-[#da2528]' : 'border-transparent hover:text-[#da2528]'}`}>
            Crew
          </Link>
          <Link href="/davy-back" className={`transition-colors py-2 border-b-2 ${pathname === '/davy-back' ? 'border-[#da2528] text-[#da2528]' : 'border-transparent hover:text-[#da2528]'}`}>
            Assembly
          </Link>
          <Link href="/challenges" className={`transition-colors py-2 border-b-2 ${pathname === '/challenges' ? 'border-[#da2528] text-[#da2528]' : 'border-transparent hover:text-[#da2528]'}`}>
            Grand Line
          </Link>
          <Link href="/fleets" className={`transition-colors py-2 border-b-2 ${pathname === '/fleets' ? 'border-[#da2528] text-[#da2528]' : 'border-transparent hover:text-[#da2528]'}`}>
            Fleet
          </Link>
        </div>
        
        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-6">
          <div className="bg-white px-4 py-1.5 rounded-full border border-gray-200 shadow-sm flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-amber-500" />
             <span className="text-[10px] font-bold uppercase tracking-widest text-[#0a192f]">LOG POSE READY</span>
          </div>
          
          <Target className="w-5 h-5 text-[#0a192f] cursor-pointer hover:opacity-70 transition-opacity" />
          
          <div className="relative cursor-pointer hover:opacity-70 transition-opacity">
            <Bell className="w-5 h-5 text-[#0a192f]" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#da2528] rounded-full border-2 border-white" />
          </div>

          <Button className="bg-[#da2528] hover:bg-[#b71c1c] text-white rounded-full font-bold tracking-wide text-xs px-6 h-10 transition-transform hover:-translate-y-0.5">
            Board the Ship <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </nav>
  );
}

