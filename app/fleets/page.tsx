"use client";
import { useEffect, useState } from 'react';
import { TeamCard } from '@/components/teams/team-card';
import { toast } from 'sonner';
import { Ship, Anchor } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function FleetsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTeams = async () => {
    try {
      const res = await fetch('/api/teams');
      const json = await res.json();
      if (json.success) {
        setTeams(json.data);
      } else {
        toast.error('Failed to load fleets');
      }
    } catch (e) {
      toast.error('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Ship className="w-8 h-8 text-primary" /> Active Fleets
          </h1>
          <p className="text-slate-500 mt-2">View generated crews and their assigned missions.</p>
        </div>
        <Button render={<Link href="/davy-back" />} className="bg-primary hover:bg-primary/90 text-white shadow-sm">
          <Anchor className="w-4 h-4 mr-2" />
          Form New Crews
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-72 bg-slate-200/50 animate-pulse rounded-xl" />)}
        </div>
      ) : teams.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-xl border border-dashed border-slate-300 shadow-sm">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Ship className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No fleets assembled yet</h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">Head to the Davy Back to match candidates into crews.</p>
          <Button render={<Link href="/davy-back" />} className="bg-primary hover:bg-primary/90">
            Proceed to Davy Back
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map(t => (
            <TeamCard key={t.id} team={t} />
          ))}
        </div>
      )}
    </div>
  );
}
