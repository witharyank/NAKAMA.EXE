"use client";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Plus } from 'lucide-react';

export function ParticipantForm({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    
    // Parse arrays correctly
    const skills = fd.get('skills')?.toString().split(',').map(s => s.trim()).filter(Boolean) || [];
    const interests = fd.get('interests')?.toString().split(',').map(s => s.trim()).filter(Boolean) || [];
    
    const data = {
      name: fd.get('name'),
      preferredRole: fd.get('preferredRole'),
      experienceLevel: Number(fd.get('experienceLevel')),
      skills,
      interests
    };

    try {
      const res = await fetch('/api/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await res.json();
      if (!res.ok) throw new Error(result.error?.message || 'Failed to create');
      
      toast.success("Participant added to the roster");
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
      <SheetTrigger render={<Button className="bg-primary hover:bg-primary/90 text-white shadow-sm" />}>
        <Plus className="w-4 h-4 mr-2" />
        Add Candidate
      </SheetTrigger>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl">Add to Roster</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required placeholder="e.g. Monkey D. Luffy" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="preferredRole">Preferred Role</Label>
            <Input id="preferredRole" name="preferredRole" required placeholder="e.g. Captain" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="experienceLevel">Experience Level (1-10)</Label>
            <Input id="experienceLevel" name="experienceLevel" type="number" min="1" max="10" required defaultValue="5" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="skills">Skills (comma-separated)</Label>
            <Input id="skills" name="skills" required placeholder="e.g. Haki, Leadership, Brawling" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interests">Interests (comma-separated)</Label>
            <Input id="interests" name="interests" placeholder="e.g. Meat, Adventure" />
          </div>
          <div className="pt-4">
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
              {loading ? "Adding..." : "Add Candidate"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
