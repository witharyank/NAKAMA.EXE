"use client";
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Compass, Anchor, AlertCircle, Users, RotateCcw, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GenerationStage } from '@/components/animations/generation-stage';
import { CrewResultCard } from '@/components/teams/crew-result-card';
import Link from 'next/link';

type ViewState = 'CONFIGURATION' | 'GENERATING' | 'RESULTS';

export default function DavyBackPage() {
  const [viewState, setViewState] = useState<ViewState>('CONFIGURATION');
  const [challenges, setChallenges] = useState<any[]>([]);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState<string>('');
  const [generatedTeams, setGeneratedTeams] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [cRes, pRes] = await Promise.all([
        fetch('/api/challenges'),
        fetch('/api/participants')
      ]);
      
      const cJson = await cRes.json();
      const pJson = await pRes.json();
      
      if (cJson.success) setChallenges(cJson.data);
      if (pJson.success) {
        const unassigned = pJson.data.filter((p: any) => !p.teamId);
        setParticipantsCount(unassigned.length);
      }
    } catch (e) {
      toast.error("Failed to load data for Davy Back.");
    } finally {
      setLoading(false);
    }
  }

  const handleGenerateClick = async () => {
    if (!selectedChallenge) return toast.error("Please select a mission first.");
    
    // Switch UI to GSAP animation sequence state
    setViewState('GENERATING');
    
    // Fire the API call concurrently behind the scenes
    try {
      const res = await fetch('/api/teams/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId: selectedChallenge })
      });
      const data = await res.json();
      
      if (res.ok) {
        setGeneratedTeams(data.data?.teams || []);
      } else {
        toast.error(data.error?.message || "Failed to generate crews.");
        setViewState('CONFIGURATION');
      }
    } catch (e) {
      toast.error("Generation failed due to a server error.");
      setViewState('CONFIGURATION');
    }
  };

  const handleAnimationComplete = () => {
    // Called when GSAP timeline finishes its visual 4s sequence
    if (generatedTeams.length > 0) {
      setViewState('RESULTS');
      toast.success(`Successfully generated ${generatedTeams.length} crew(s)!`);
      loadData(); // reload participants count
    } else if (viewState === 'GENERATING') {
      // If we got here but teams are empty, we probably hit an error that hasn't unmounted us yet
      // Or 0 teams could be formed
      setViewState('RESULTS');
    }
  };

  const resetToConfig = () => {
    setSelectedChallenge('');
    setGeneratedTeams([]);
    setViewState('CONFIGURATION');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl text-center">
        <div className="animate-pulse space-y-4">
          <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto" />
          <div className="w-64 h-8 bg-slate-200 rounded mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-8 py-16 max-w-5xl">
      <div className="text-center mb-16 border-b-2 border-[#e6e0d3] pb-12">
        <div className="mx-auto w-24 h-24 bg-[#0a192f] rounded-none flex items-center justify-center mb-8 border border-[#c62828] shadow-[4px_4px_0_0_#d4af37] rotate-45 transition-transform duration-700 hover:rotate-90">
          <div className="-rotate-45 transition-transform duration-700 hover:-rotate-90">
            <Compass className="w-12 h-12 text-[#fdfbf7]" />
          </div>
        </div>
        <p className="text-[10px] font-bold text-[#c62828] uppercase tracking-[0.4em] mb-4">
          Algorithmic Assembly
        </p>
        <h1 className="text-6xl font-bold text-[#0a192f] font-serif tracking-tight mb-6">The Davy Back</h1>
        {viewState === 'CONFIGURATION' && (
          <p className="text-[#0a192f]/60 mt-4 text-xl max-w-2xl mx-auto leading-relaxed">
            Initiate the deterministic compatibility engine to assemble optimal fleets for active missions.
          </p>
        )}
      </div>

      {viewState === 'CONFIGURATION' && (
        <Card className="border border-[#e6e0d3] shadow-lg bg-white overflow-hidden max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-300 rounded-none relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#c62828]" />
          <div className="absolute top-1 left-0 w-full h-px bg-[#d4af37]" />
          <CardHeader className="pb-6 pt-10 px-10 border-b border-[#e6e0d3] bg-[#fdfbf7]">
            <CardTitle className="font-serif text-2xl text-[#0a192f]">Formation Protocol</CardTitle>
            <CardDescription className="text-[#0a192f]/60 text-sm tracking-widest uppercase font-bold mt-2">Configure operational parameters.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-10 p-10">
            <div className="bg-[#fdfbf7] border border-[#e6e0d3] p-6 flex items-start gap-5">
              <Users className="w-6 h-6 text-[#c62828] shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-[#0a192f] tracking-wide uppercase text-sm">Available Candidates</h3>
                <p className="text-[#0a192f]/70 text-sm mt-2 leading-relaxed">There are currently <strong className="text-[#c62828] text-lg mx-1">{participantsCount}</strong> unassigned candidates awaiting formation.</p>
                {participantsCount === 0 && (
                  <p className="text-sm text-[#b33939] mt-3 flex items-center gap-2 font-bold bg-[#b33939]/10 p-2 border border-[#b33939]/20">
                    <AlertCircle className="w-4 h-4" /> Insufficient candidates. Register participants first.
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-[#0a192f] uppercase tracking-[0.2em] block">Target Mission</label>
              <Select value={selectedChallenge} onValueChange={(v) => setSelectedChallenge(v || '')} disabled={challenges.length === 0}>
                <SelectTrigger className="w-full h-14 text-base rounded-none border-[#e6e0d3] bg-[#fdfbf7] focus:ring-[#c62828] focus:border-[#c62828]">
                  <SelectValue placeholder={challenges.length === 0 ? "No missions available" : "Select a mission to match crews against..."} />
                </SelectTrigger>
                <SelectContent className="rounded-none border-[#e6e0d3]">
                  {challenges.map(c => (
                    <SelectItem key={c.id} value={c.id} className="cursor-pointer">
                      <span className="font-bold text-[#0a192f]">{c.title}</span> <span className="text-[#0a192f]/50 ml-2 text-xs">SIZE: {c.teamSize}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {challenges.length === 0 && (
                <p className="text-sm text-[#0a192f]/60 flex items-center gap-2 mt-3 font-medium italic">
                  <AlertCircle className="w-4 h-4 text-[#d4af37]" /> A mission must be charted before matching can begin.
                </p>
              )}
            </div>

            <div className="pt-8 border-t border-[#e6e0d3]">
              <Button 
                size="lg" 
                className="w-full h-16 text-lg font-bold bg-[#c62828] hover:bg-[#a01f1f] text-white shadow-md transition-all active:scale-[0.98] rounded-none uppercase tracking-[0.2em] group"
                onClick={handleGenerateClick}
                disabled={participantsCount === 0 || challenges.length === 0 || !selectedChallenge}
              >
                <Anchor className="w-5 h-5 mr-3 text-white/50 group-hover:text-white transition-colors" /> Initiate Assembly Sequence
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {viewState === 'GENERATING' && (
        <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
          <GenerationStage 
            onComplete={handleAnimationComplete} 
            participantCount={participantsCount} 
          />
        </div>
      )}

      {viewState === 'RESULTS' && (
        <div className="space-y-12 animate-in fade-in duration-500">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 bg-white p-6 border-2 border-[#e6e0d3] shadow-sm relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#c62828]" />
            <div className="pl-4">
              <p className="text-[#0a192f] font-serif text-xl text-center sm:text-left">
                Successfully assembled <strong className="text-[#c62828] text-2xl mx-1">{generatedTeams.length}</strong> optimal fleet(s).
              </p>
            </div>
            <div className="flex gap-4 w-full sm:w-auto">
              <Button variant="outline" onClick={resetToConfig} className="flex-1 sm:flex-none bg-[#fdfbf7] text-[#0a192f] border-[#0a192f]/20 hover:bg-[#0a192f]/5 rounded-none font-bold uppercase tracking-widest text-[10px] h-12 px-6">
                <RotateCcw className="w-3 h-3 mr-2" /> Rematch
              </Button>
              <Button render={<Link href="/fleets" />} className="flex-1 sm:flex-none bg-[#0a192f] hover:bg-[#0a192f]/90 text-white rounded-none font-bold uppercase tracking-widest text-[10px] h-12 px-6">
                View Ledger <ArrowRight className="w-3 h-3 ml-2 text-[#d4af37]" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {generatedTeams.length > 0 ? (
              generatedTeams.map((team, index) => (
                <CrewResultCard key={team.id} team={team} delay={index * 0.15} />
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-white border border-[#e6e0d3] shadow-sm flex flex-col items-center justify-center">
                <AlertCircle className="w-12 h-12 text-[#0a192f]/20 mb-4" />
                <h3 className="text-2xl font-serif font-bold text-[#0a192f] mb-2">Formation Failed</h3>
                <p className="text-[#0a192f]/60 max-w-md mx-auto text-lg">Insufficient compatible candidates to fulfill the mission requirements.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
