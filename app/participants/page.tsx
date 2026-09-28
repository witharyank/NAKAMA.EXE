"use client";
import { useEffect, useState } from 'react';
import { ParticipantCard } from '@/components/participants/participant-card';
import { ParticipantForm } from '@/components/participants/participant-form';
import { toast } from 'sonner';
import { Users } from 'lucide-react';

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadParticipants = async () => {
    try {
      const res = await fetch('/api/participants');
      const json = await res.json();
      if (json.success) {
        setParticipants(json.data);
      } else {
        toast.error('Failed to load participants');
      }
    } catch (e) {
      toast.error('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParticipants();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" /> Roster
          </h1>
          <p className="text-slate-500 mt-2">Manage the available talent pool for your fleets.</p>
        </div>
        <ParticipantForm onCreated={loadParticipants} />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-48 bg-slate-200/50 animate-pulse rounded-xl" />)}
        </div>
      ) : participants.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-xl border border-dashed border-slate-300 shadow-sm">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No candidates yet</h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">Start building your roster by adding the first crew candidate.</p>
          <ParticipantForm onCreated={loadParticipants} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {participants.map(p => (
            <ParticipantCard key={p.id} participant={p} />
          ))}
        </div>
      )}
    </div>
  );
}
