import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';

export default function Login() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user && !loading) {
      // Redirect to the page they were trying to visit, or dashboard
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, location]);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black uppercase tracking-tighter">Login Required</h1>
        <p className="text-[#777] font-bold">Please sign in to access this page.</p>
      </div>
      <AuthModal isOpen={!user} onClose={() => {}} canDismiss={false} />
    </div>
  );
}
