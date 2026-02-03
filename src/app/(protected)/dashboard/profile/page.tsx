'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { toast } from 'sonner';
import type { Profile } from '@/lib/types';

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', phone: '', city: '' });
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push('/login');
          return;
        }

        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();

        if (data) {
          setProfile(data);
          setFormData({
            full_name: data.full_name || '',
            phone: data.phone || '',
            city: data.city || '',
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [supabase, router]);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user.id);

      if (error) {
        toast.error('Failed to save profile');
        return;
      }

      setProfile({ ...profile, ...formData } as Profile);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex">
        <DashboardSidebar />
        <div className="flex-1 p-8">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-blue-50">
      <DashboardSidebar />
      <div className="flex-1 p-8">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-dark mb-8">Profile</h1>

          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your profile details</CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-6">
                  <Input
                    id="full_name"
                    label="Full Name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  />
                  <Input
                    id="phone"
                    label="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <Input
                    id="city"
                    label="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                  <div className="flex gap-3">
                    <Button onClick={handleSave} isLoading={isSaving}>
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-medium-grey mb-1">Full Name</p>
                    <p className="text-dark font-medium">{profile?.full_name || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-medium-grey mb-1">Phone Number</p>
                    <p className="text-dark font-medium">{profile?.phone || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-medium-grey mb-1">City</p>
                    <p className="text-dark font-medium">{profile?.city || 'Not set'}</p>
                  </div>
                  <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
