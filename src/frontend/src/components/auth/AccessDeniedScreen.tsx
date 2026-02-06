import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';

export default function AccessDeniedScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-700">Access Denied</CardTitle>
          <CardDescription className="text-base">
            You don't have permission to access this area. Admin privileges are required.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={() => navigate({ to: '/dashboard' })} className="w-full bg-blue-600 hover:bg-blue-700">
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
