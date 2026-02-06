import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Shield, Lock } from 'lucide-react';

interface AdminPasswordGateProps {
  onUnlock: (password: string) => boolean;
}

export default function AdminPasswordGate({ onUnlock }: AdminPasswordGateProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const success = onUnlock(password);
    
    if (!success) {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Admin Access</CardTitle>
          <CardDescription>Enter the admin password to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="pl-10"
                  required
                  autoFocus
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !password}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? 'Verifying...' : 'Unlock Admin Panel'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
