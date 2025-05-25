
import { useAuth } from '@/hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Allow bypass for testing - check both location state and localStorage
  const isFromBypass = location.state?.fromBypass || localStorage.getItem('auth-bypass') === 'true';
  
  if (!user && !isFromBypass) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
