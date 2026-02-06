import { useState, useEffect } from 'react';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../../hooks/queries/useCallerUserProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalBlob } from '../../backend';
import { Upload, User, Save } from 'lucide-react';

export default function ProfilePage() {
  const { data: userProfile, isLoading } = useGetCallerUserProfile();
  const { mutate: saveProfile, isPending } = useSaveCallerUserProfile();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setFirstName(userProfile.firstName);
      setLastName(userProfile.lastName);
      setEmail(userProfile.email);
    }
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let resumeBlob: ExternalBlob | undefined = userProfile?.resume;

    if (resumeFile) {
      const arrayBuffer = await resumeFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      resumeBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });
    }

    saveProfile(
      {
        firstName,
        lastName,
        email,
        resume: resumeBlob,
      },
      {
        onSuccess: () => {
          setSaved(true);
          setResumeFile(null);
          setUploadProgress(0);
          setTimeout(() => setSaved(false), 3000);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-2">My Profile</h2>
        <p className="text-gray-600">Manage your personal information</p>
      </div>

      <Card className="max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <User className="w-6 h-6" />
            Profile Information
          </CardTitle>
          <CardDescription>Update your details and resume</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  placeholder="Enter your first name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your.email@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resume">Resume</Label>
              {userProfile?.resume && !resumeFile && (
                <div className="mb-2">
                  <a
                    href={userProfile.resume.getDirectURL()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View Current Resume
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  className="cursor-pointer"
                />
                <Upload className="w-5 h-5 text-gray-400" />
              </div>
              {resumeFile && <p className="text-sm text-gray-600">Selected: {resumeFile.name}</p>}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
            </div>

            {saved && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 text-center">
                Profile updated successfully!
              </div>
            )}

            <Button type="submit" disabled={isPending} className="w-full bg-blue-600 hover:bg-blue-700 py-6 gap-2">
              <Save className="w-5 h-5" />
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
