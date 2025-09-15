import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, Shield } from "lucide-react";
import SEEDlogo from "@/assets/SEEDlogo.png";

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        onLogin();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src={SEEDlogo} alt="SEED Logo" className="w-20 h-20" />
          </div>
          <h1 className="text-3xl font-bold text-green-100 mb-2">
            SEED Admin Portal
          </h1>
          <p className="text-green-300">
            Access the project proposals dashboard
          </p>
        </div>

        <Card className="bg-green-800 border-green-700">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-2">
              <Shield className="h-6 w-6 text-green-400" />
            </div>
            <CardTitle className="text-2xl text-center text-green-100">
              Admin Login
            </CardTitle>
            <CardDescription className="text-center text-green-300">
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-green-100">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@rutgers.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-green-700/50 border-green-600 text-green-100 placeholder:text-green-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-green-100">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-green-700/50 border-green-600 text-green-100 placeholder:text-green-300"
                />
              </div>

              {error && (
                <div className="bg-red-900/50 border border-red-600 rounded-lg p-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                  <p className="text-red-100 text-sm">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-500 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-green-300 text-sm">
                Need access? Contact the SEED Project Manager
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-green-400 text-sm">
            Secure admin access for SEED project management
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
