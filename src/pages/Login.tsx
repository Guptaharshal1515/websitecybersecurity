
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Shield, Lock, User } from 'lucide-react';

export const Login = () => {
  const { signIn, signUp, user, userRole } = useAuth();
  const { themeColors } = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ email: '', password: '', username: '' });

  // Redirect authenticated users
  if (user) {
    if (userRole === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await signIn(loginForm.email, loginForm.password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Login successful!');
        // Navigation will be handled by auth state change
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await signUp(signupForm.email, signupForm.password, signupForm.username);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Account created successfully! Please check your email to verify your account.');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: themeColors.background }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div 
            className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: themeColors.primary + '20' }}
          >
            <Shield className="h-8 w-8" style={{ color: themeColors.primary }} />
          </div>
          <h1 
            className="text-2xl font-bold"
            style={{ color: themeColors.text }}
          >
            WebsiteCyberSec
          </h1>
          <p 
            className="text-sm mt-2"
            style={{ color: themeColors.accent }}
          >
            Secure Access Portal
          </p>
        </div>

        <Card style={{ backgroundColor: themeColors.surface }} className="border-0">
          <CardHeader>
            <CardTitle 
              className="text-center"
              style={{ color: themeColors.primary }}
            >
              Authentication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList 
                className="grid w-full grid-cols-2 mb-6"
                style={{ backgroundColor: themeColors.background }}
              >
                <TabsTrigger 
                  value="login"
                  style={{ color: themeColors.text }}
                >
                  Login
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  style={{ color: themeColors.text }}
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Input
                      type="email"
                      placeholder="Email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      required
                      style={{ backgroundColor: themeColors.background, color: themeColors.text }}
                    />
                  </div>
                  <div>
                    <Input
                      type="password"
                      placeholder="Password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                      style={{ backgroundColor: themeColors.background, color: themeColors.text }}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading}
                    style={{ backgroundColor: themeColors.primary }}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <Input
                      placeholder="Username (optional)"
                      value={signupForm.username}
                      onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value })}
                      style={{ backgroundColor: themeColors.background, color: themeColors.text }}
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Email"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                      required
                      style={{ backgroundColor: themeColors.background, color: themeColors.text }}
                    />
                  </div>
                  <div>
                    <Input
                      type="password"
                      placeholder="Password"
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                      required
                      style={{ backgroundColor: themeColors.background, color: themeColors.text }}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading}
                    style={{ backgroundColor: themeColors.primary }}
                  >
                    <User className="h-4 w-4 mr-2" />
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p 
            className="text-sm"
            style={{ color: themeColors.accent }}
          >
            Admin credentials: guptaharshal / guptaharshal@1515
          </p>
        </div>
      </div>
    </div>
  );
};
