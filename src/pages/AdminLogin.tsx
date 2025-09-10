import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simple password check - in production, use proper authentication
    if (password === 'seed-admin-2024') {
      localStorage.setItem('admin-authenticated', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Invalid password');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-green-950 flex items-center justify-center px-4">
      <div className="bg-gradient-to-br from-green-800 to-green-900 p-8 rounded-xl border border-green-700 shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-100 mb-2">
            SEED Admin Panel
          </h1>
          <p className="text-green-200">
            Enter password to access admin features
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="password" className="text-green-100 font-medium">
              Admin Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-green-800/50 border-green-600 text-green-100"
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded border border-red-800">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-500"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="text-green-200 hover:text-green-100 hover:bg-green-800/50"
          >
            ← Back to Form
          </Button>
        </div>
      </div>
    </div>
  );
}