"use client";
import { useEffect, useState } from 'react';
import { ChallengeCard } from '@/components/challenges/challenge-card';
import { ChallengeForm } from '@/components/challenges/challenge-form';
import { toast } from 'sonner';
import { Map } from 'lucide-react';

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadChallenges = async () => {
    try {
      const res = await fetch('/api/challenges');
      const json = await res.json();
      if (json.success) {
        setChallenges(json.data);
      } else {
        toast.error('Failed to load challenges');
      }
    } catch (e) {
      toast.error('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChallenges();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Map className="w-8 h-8 text-accent" /> Mission Board
          </h1>
          <p className="text-slate-500 mt-2">Define the challenges and requirements for your crews.</p>
        </div>
        <ChallengeForm onCreated={loadChallenges} />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-64 bg-slate-200/50 animate-pulse rounded-xl" />)}
        </div>
      ) : challenges.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-xl border border-dashed border-slate-300 shadow-sm">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Map className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No active missions</h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">Post your first mission to start matching crews.</p>
          <ChallengeForm onCreated={loadChallenges} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map(c => (
            <ChallengeCard key={c.id} challenge={c} />
          ))}
        </div>
      )}
    </div>
  );
}
