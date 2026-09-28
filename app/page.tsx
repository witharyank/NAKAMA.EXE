import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Anchor, Users, Map, Ship } from 'lucide-react';
import TigerTearReveal from '@/components/ui/tiger-tear-reveal';

export default function Home() {
  return (
    <div className="w-full flex-1 flex flex-col">
      <TigerTearReveal 
        word="NAKAMA" 
        tagline="ASSEMBLE YOUR" 
        ink="#0d5f66" 
        paper="#fdfbf7"
        taglineColor="#b48529"
      />
      
      <section className="flex flex-col items-center justify-center bg-[#fdfbf7] min-h-[40vh] text-center border-t border-[#e6e0d3]">
        <div className="max-w-4xl w-full flex flex-col items-center gap-8 py-20">
          <p className="text-sm tracking-[0.3em] text-[#0a192f]/50 font-bold uppercase">The formation engine awaits</p>
          <Button render={<Link href="/davy-back" />} size="lg" className="text-xl h-16 px-12 bg-[#c62828] hover:bg-[#a01f1f] text-white shadow-lg tracking-widest font-serif rounded-none border border-[#c62828]/20">
            ENTER THE SHIP
          </Button>
        </div>
      </section>
    </div>
  );
}
