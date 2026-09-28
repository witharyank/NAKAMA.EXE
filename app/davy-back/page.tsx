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
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-10">
        <div className="mx-auto w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-6 text-accent border border-accent/20 shadow-inner">
          <Compass className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">The Davy Back Match</h1>
        {viewState === 'CONFIGURATION' && (
          <p className="text-slate-500 mt-3 text-lg max-w-xl mx-auto">
            Prepare for the ultimate crew formation. Select a mission, and our smart engine will analyze skills, balance roles, and assemble the perfect fleets.
          </p>
        )}
      </div>

      {viewState === 'CONFIGURATION' && (
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-300">
          <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />
          <CardHeader className="pb-4">
            <CardTitle>Formation Protocol</CardTitle>
            <CardDescription>Configure your generation parameters.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-5 flex items-start gap-4">
              <Users className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-slate-800">Available Candidates</h3>
                <p className="text-slate-600 text-sm mt-1">There are currently <strong className="text-slate-900">{participantsCount}</strong> unassigned candidates ready to join a crew.</p>
                {participantsCount === 0 && (
                  <p className="text-sm text-destructive mt-2 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" /> You need to add participants before forming crews.
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 block">Target Mission</label>
              <Select value={selectedChallenge} onValueChange={(v) => setSelectedChallenge(v || '')} disabled={challenges.length === 0}>
                <SelectTrigger className="w-full h-12 text-base">
                  <SelectValue placeholder={challenges.length === 0 ? "No missions available" : "Select a mission for the fleet..."} />
                </SelectTrigger>
                <SelectContent>
                  {challenges.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.title} (Crew size: {c.teamSize})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {challenges.length === 0 && (
                <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-2">
                  <AlertCircle className="w-4 h-4" /> Go to the Challenges page to create one first.
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100">
              <Button 
                size="lg" 
                className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-white shadow-md transition-transform active:scale-[0.98]"
                onClick={handleGenerateClick}
                disabled={participantsCount === 0 || challenges.length === 0 || !selectedChallenge}
              >
                <Anchor className="w-5 h-5 mr-2" /> Start Crew Generation
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
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-slate-700 font-medium text-center sm:text-left">
              Successfully assembled <strong className="text-slate-900">{generatedTeams.length}</strong> optimal crew(s).
            </p>
            <div className="flex gap-3 w-full sm:w-auto">
              <Button variant="outline" onClick={resetToConfig} className="flex-1 sm:flex-none bg-white text-slate-600 border-slate-300">
                <RotateCcw className="w-4 h-4 mr-2" /> Match Again
              </Button>
              <Button render={<Link href="/fleets" />} className="flex-1 sm:flex-none bg-accent hover:bg-accent/90">
                View All Fleets <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {generatedTeams.length > 0 ? (
              generatedTeams.map((team, index) => (
                <CrewResultCard key={team.id} team={team} delay={index * 0.15} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-slate-900">No complete crews formed</h3>
                <p className="text-slate-500 max-w-md mx-auto">There were not enough matching candidates available to form a full crew for this mission.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
