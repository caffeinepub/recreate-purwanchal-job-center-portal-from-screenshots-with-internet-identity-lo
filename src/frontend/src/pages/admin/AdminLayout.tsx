import { Outlet, useNavigate, useLocation } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Briefcase, FileText, Shield, Lock, Loader2 } from 'lucide-react';
import { useAdminPassword } from '../../hooks/useAdminPassword';
import AdminPasswordGate from '../../components/admin/AdminPasswordGate';
import Logo from '../../components/branding/Logo';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isUnlocked, isChecking, checkError, unlock, lock } = useAdminPassword();

  const handleLock = () => {
    lock();
  };

  const tabs = [
    { path: '/admin', label: 'Manage Vacancies', icon: Briefcase },
    { path: '/admin/posts', label: 'Manage Posts', icon: FileText },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin' || location.pathname === '/admin/';
    }
    return location.pathname.startsWith(path);
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Checking admin access...</p>
        </div>
      </div>
    );
  }

  if (!isUnlocked) {
    return <AdminPasswordGate onUnlock={unlock} initialError={checkError} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Logo size="sm" />
              <div>
                <h1 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
                  <Shield className="w-6 h-6" />
                  Admin Panel
                </h1>
                <p className="text-sm text-gray-600">Purwanchal Job Center</p>
              </div>
            </div>

            <Button onClick={handleLock} variant="outline" size="sm" className="gap-2">
              <Lock className="w-4 h-4" />
              Lock Admin
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-md p-2 flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.path);
            return (
              <button
                key={tab.path}
                onClick={() => navigate({ to: tab.path })}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                  active
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        <Outlet />
      </div>
    </div>
  );
}
