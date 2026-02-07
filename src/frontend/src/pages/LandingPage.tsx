import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/queries/useCallerUserProfile';
import { useGetCallerRole } from '../hooks/queries/useCallerRole';
import { useEffect } from 'react';
import { Briefcase, Users, TrendingUp, Phone, MapPin } from 'lucide-react';
import { SiFacebook, SiX, SiWhatsapp, SiInstagram } from 'react-icons/si';
import { Button } from '@/components/ui/button';
import Logo from '../components/branding/Logo';

export default function LandingPage() {
  const navigate = useNavigate();
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: role } = useGetCallerRole();

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (isAuthenticated && !profileLoading && isFetched) {
      if (userProfile === null) {
        navigate({ to: '/onboarding' });
      } else if (role === 'admin') {
        navigate({ to: '/admin' });
      } else {
        navigate({ to: '/dashboard' });
      }
    }
  }, [isAuthenticated, userProfile, profileLoading, isFetched, role, navigate]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  const handleAdminLogin = () => {
    navigate({ to: '/admin' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <Logo size="lg" className="mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-3">Purwanchal Job Center</h1>
          <p className="text-lg text-gray-600 mb-2">Job Center in Birtamode, Jhapa, Nepal</p>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Find employment opportunities near you - Empowering Nepali professionals to connect, grow, and succeed
          </p>
        </div>

        {/* Contact Info Strip */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl shadow-md p-6 border border-red-100">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-red-600 shrink-0" />
                <div className="text-red-700 font-semibold">
                  <div>
                    <a href="tel:9804968758" className="hover:underline">
                      9804968758
                    </a>
                  </div>
                  <div>
                    <a href="tel:9814965177" className="hover:underline">
                      9814965177
                    </a>
                  </div>
                </div>
              </div>
              <div className="hidden md:block w-px h-12 bg-red-200"></div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-600 shrink-0 mt-1" />
                <div className="text-red-700 font-medium">
                  Birtamode-04, Jhapa, Nepal
                  <br />
                  (Opposite to New Gomendra College)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Briefcase className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">For Job Seekers</h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Browse thousands of job opportunities near Jhapa, create your professional profile, and apply directly to
              employers in Nepal.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Users className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">For Employers</h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Post job openings in Birtamode and across Nepal, review applications, and connect with qualified
              candidates to build your team.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Career Growth</h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Access career resources, stay updated with industry news, and advance your professional journey in Nepal.
            </p>
          </div>
        </div>

        {/* Get Started Card */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Get Started</h2>
            <p className="text-gray-600 mb-6 text-center">
              Sign in securely with Internet Identity to access the platform
            </p>

            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 rounded-xl shadow-md transition-all mb-4"
            >
              {isLoggingIn ? 'Signing In...' : 'Sign In with Internet Identity'}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">OR</span>
              </div>
            </div>

            <Button
              onClick={handleAdminLogin}
              variant="outline"
              className="w-full border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-6 rounded-xl transition-all"
            >
              <span className="mr-2">🛡️</span> Admin Login
            </Button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Secure authentication powered by Internet Computer
            </p>
          </div>
        </div>
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
        </div>
      </footer>
    </div>
  );
}
