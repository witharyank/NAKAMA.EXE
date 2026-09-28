"use client";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Plus } from 'lucide-react';

export function ChallengeForm({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    
    const requiredSkills = fd.get('requiredSkills')?.toString().split(',').map(s => s.trim()).filter(Boolean) || [];
    const requiredRoles = fd.get('requiredRoles')?.toString().split(',').map(s => s.trim()).filter(Boolean) || [];
    
    const data = {
      title: fd.get('title'),
      description: fd.get('description'),
      teamSize: Number(fd.get('teamSize')),
      difficulty: fd.get('difficulty'),
      requiredSkills,
      requiredRoles
    };

    try {
      const res = await fetch('/api/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await res.json();
      if (!res.ok) throw new Error(result.error?.message || 'Failed to create');
      
      toast.success("Mission added to the board");
      setOpen(false);
      onCreated();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button className="bg-accent hover:bg-accent/90 text-white shadow-sm" />}>
        <Plus className="w-4 h-4 mr-2" />
        Post Mission
      </SheetTrigger>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl">Post New Mission</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required placeholder="e.g. Infiltrate Enies Lobby" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" name="description" required placeholder="A dangerous mission to rescue a comrade." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="teamSize">Crew Size</Label>
              <Input id="teamSize" name="teamSize" type="number" min="1" required defaultValue="3" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Input id="difficulty" name="difficulty" required defaultValue="Grand Line" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="requiredSkills">Required Skills (comma-separated)</Label>
            <Input id="requiredSkills" name="requiredSkills" required placeholder="e.g. Navigation, Sniping" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="requiredRoles">Required Roles (comma-separated)</Label>
            <Input id="requiredRoles" name="requiredRoles" required placeholder="e.g. Navigator, Sniper" />
          </div>
          <div className="pt-4">
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={loading}>
              {loading ? "Posting..." : "Post Mission"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
