import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin-authenticated');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-green-950 text-white">
      <header className="bg-green-800 border-b border-green-700 px-6 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-green-100">
              SEED Admin Panel
            </h1>
            <p className="text-green-200 text-sm">
              {title}
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-green-600 text-green-100 hover:bg-green-700"
          >
            Logout
          </Button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}