import { Outlet, useNavigate, useLocation } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../hooks/queries/useCallerUserProfile';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Briefcase, FileText, MessageSquare, Bell, User, Gift, Phone, MapPin } from 'lucide-react';
import { SiFacebook, SiX, SiWhatsapp, SiInstagram } from 'react-icons/si';
import Logo from '../../components/branding/Logo';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { identity, clear } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/' });
      return;
    }

    if (!profileLoading && isFetched && userProfile === null) {
      navigate({ to: '/onboarding' });
    }
  }, [identity, userProfile, profileLoading, isFetched, navigate]);

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  const tabs = [
    { path: '/dashboard', label: 'Browse Jobs', icon: Briefcase },
    { path: '/dashboard/applications', label: 'My Applications', icon: FileText },
    { path: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
    { path: '/dashboard/updates', label: 'Updates', icon: Bell },
    { path: '/dashboard/profile', label: 'Profile', icon: User },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/dashboard/';
    }
    return location.pathname.startsWith(path);
  };

  if (profileLoading || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
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
                <h1 className="text-2xl font-bold text-blue-700">Purwanchal Job Center</h1>
                <p className="text-sm text-gray-600">Professional Job Portal</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-gray-800">
                  {userProfile.firstName} {userProfile.lastName}
                </p>
                <p className="text-xs text-gray-600">Job Seeker</p>
              </div>
              <Button onClick={handleLogout} variant="outline" size="sm" className="gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>

          {/* Contact Strip */}
          <div className="mt-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-3 border border-red-100">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-600 shrink-0" />
                <span className="text-red-700 font-medium">
                  <a href="tel:9804968758" className="hover:underline">
                    9804968758
                  </a>{' '}
                  |{' '}
                  <a href="tel:9814965177" className="hover:underline">
                    9814965177
                  </a>
                </span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-red-200"></div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-600" />
                <span className="text-red-700">Birtamode-04, Jhapa, Nepal (Opposite to New Gomendra College)</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Share Card */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-md p-6 border border-blue-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center shrink-0">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Share Purwanchal Job Center</h3>
              <p className="text-gray-600 text-sm mb-4">
                Help us connect more job seekers with opportunities in Nepal. Share our platform on social media and
                earn exclusive rewards. The more you share, the more you earn!
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Share now:</span>
                <a
                  href="https://www.facebook.com/profile.php?id=61575264476230"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <SiFacebook className="w-4 h-4 text-white" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-900 transition-colors"
                >
                  <SiX className="w-4 h-4 text-white" />
                </a>
                <a
                  href="https://wa.me/9804968758"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-green-500 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors"
                >
                  <SiWhatsapp className="w-4 h-4 text-white" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center hover:from-purple-700 hover:to-pink-600 transition-colors"
                >
                  <SiInstagram className="w-4 h-4 text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 mb-6">
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
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        <Outlet />
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Logo size="sm" />
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-red-600" />
                  <span className="text-red-700 font-medium">
                    <a href="tel:9804968758" className="hover:underline">
                      9804968758
                    </a>{' '}
                    |{' '}
                    <a href="tel:9814965177" className="hover:underline">
                      9814965177
                    </a>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <MapPin className="w-4 h-4 text-red-600" />
                  <span className="text-gray-700">Birtamode-04, Jhapa, Nepal (Opposite to New Gomendra College)</span>
                </div>
              </div>
            </div>

            <div className="text-center md:text-right">
              <p className="text-sm text-gray-600 mb-2">
                Purwanchal Job Center - Connecting Talent with Opportunity
              </p>
              <div className="flex items-center justify-center md:justify-end gap-1">
                <span className="text-sm text-gray-600 mr-2">Share:</span>
                <a
                  href="https://www.facebook.com/profile.php?id=61575264476230"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <SiFacebook className="w-4 h-4 text-white" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-900 transition-colors"
                >
                  <SiX className="w-4 h-4 text-white" />
                </a>
                <a
                  href="https://wa.me/9804968758"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                >
                  <SiWhatsapp className="w-4 h-4 text-white" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center hover:from-purple-700 hover:to-pink-600 transition-colors"
                >
                  <SiInstagram className="w-4 h-4 text-white" />
                </a>
              </div>
            </div>
          </div>
          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              © 2026. Built with ❤️ using{' '}
              <a
                href="https://caffeine.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-medium"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
