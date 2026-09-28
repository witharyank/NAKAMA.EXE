import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Anchor, Compass, Ship, Users, Map } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-4xl w-full space-y-8">
        <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 text-primary">
          <Compass className="w-12 h-12" />
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900">
          Assemble Your <span className="text-primary">Crew</span>
        </h1>
        
        <p className="text-xl text-slate-600 max-w-xl mx-auto leading-relaxed">
          The smart team formation engine for high-stakes challenges. 
          Match skills, balance roles, and prepare your fleet for the Davy Back Fight.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Button render={<Link href="/davy-back" />} size="lg" className="w-full sm:w-auto text-lg h-14 px-8 bg-primary hover:bg-primary/90">
            <Anchor className="mr-2 w-5 h-5" /> Form a Crew
          </Button>
          <Button render={<Link href="/participants" />} variant="outline" size="lg" className="w-full sm:w-auto text-lg h-14 px-8 border-slate-300 text-slate-700">
            <Users className="mr-2 w-5 h-5" /> View Participants
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-16 text-left">
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
            <Users className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-semibold text-lg mb-2">Participant Pool</h3>
            <p className="text-sm text-slate-600">Register candidates with specific skills, preferred roles, and experience levels.</p>
          </div>
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
            <Map className="w-8 h-8 text-accent mb-4" />
            <h3 className="font-semibold text-lg mb-2">Active Challenges</h3>
            <p className="text-sm text-slate-600">Define missions that require specific skill sets and team compositions.</p>
          </div>
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
            <Ship className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-semibold text-lg mb-2">Smart Matching</h3>
            <p className="text-sm text-slate-600">Generate perfectly balanced crews using our deterministic matching engine.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
