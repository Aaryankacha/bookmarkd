import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your password.');
      return;
    }
    try {
      setError('');
      setIsSubmitting(true);
      await register(username, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = () => {
    setError('Google Sign-In is currently in demo mode. Please register with email and password.');
  };

  return (
    <AuthLayout 
      title="Create your Bookmarkd account" 
      subtitle="Track books, discover stories, and connect with readers worldwide."
    >
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-600 text-sm rounded-2xl text-center font-medium animate-fadeIn">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* USERNAME INPUT */}
        <div>
          <label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-1.5">
            Username
          </label>
          <div className="relative">
            <User className="w-5 h-5 text-[#999999] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input 
              type="text" 
              required
              placeholder="bookworm99"
              className="w-full bg-[#FAF8F5]/90 border border-black/10 rounded-2xl pl-12 pr-4 py-3 text-[#1D1D1F] placeholder:text-[#AAAAAA] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A65A]/40 focus:border-[#D4A65A] focus:bg-white transition-all shadow-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>

        {/* EMAIL INPUT */}
        <div>
          <label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-5 h-5 text-[#999999] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input 
              type="email" 
              required
              placeholder="you@example.com"
              className="w-full bg-[#FAF8F5]/90 border border-black/10 rounded-2xl pl-12 pr-4 py-3 text-[#1D1D1F] placeholder:text-[#AAAAAA] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A65A]/40 focus:border-[#D4A65A] focus:bg-white transition-all shadow-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* PASSWORD INPUT */}
        <div>
          <label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="w-5 h-5 text-[#999999] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input 
              type={showPassword ? 'text' : 'password'} 
              required
              minLength="6"
              placeholder="At least 6 characters"
              className="w-full bg-[#FAF8F5]/90 border border-black/10 rounded-2xl pl-12 pr-12 py-3 text-[#1D1D1F] placeholder:text-[#AAAAAA] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A65A]/40 focus:border-[#D4A65A] focus:bg-white transition-all shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#1D1D1F] transition-colors p-1"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* CONFIRM PASSWORD INPUT */}
        <div>
          <label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="w-5 h-5 text-[#999999] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input 
              type={showConfirmPassword ? 'text' : 'password'} 
              required
              minLength="6"
              placeholder="Repeat your password"
              className="w-full bg-[#FAF8F5]/90 border border-black/10 rounded-2xl pl-12 pr-12 py-3 text-[#1D1D1F] placeholder:text-[#AAAAAA] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A65A]/40 focus:border-[#D4A65A] focus:bg-white transition-all shadow-sm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button 
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#1D1D1F] transition-colors p-1"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#D4A65A] hover:bg-[#C29549] text-white font-semibold py-3.5 px-6 rounded-2xl transition-all duration-300 shadow-md shadow-[#D4A65A]/25 hover:shadow-lg hover:shadow-[#D4A65A]/35 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 mt-3 disabled:opacity-70 disabled:hover:translate-y-0"
        >
          <span>{isSubmitting ? 'Creating Account...' : 'Create Account'}</span>
          {!isSubmitting && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>

      {/* DIVIDER */}
      <div className="relative my-5 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-black/10"></div>
        </div>
        <span className="relative bg-white px-4 text-xs uppercase tracking-wider text-[#999999] font-medium font-sans">
          Or continue with
        </span>
      </div>

      {/* GOOGLE SIGN IN BUTTON */}
      <button 
        type="button"
        onClick={handleGoogleSignIn}
        className="w-full bg-white hover:bg-[#FAF8F5] border border-black/10 hover:border-black/20 text-[#1D1D1F] font-medium py-3 px-6 rounded-2xl transition-all shadow-sm flex items-center justify-center gap-3 hover:-translate-y-0.5 active:translate-y-0 text-sm"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
        <span>Continue with Google</span>
      </button>

      {/* BOTTOM LINK */}
      <p className="mt-6 text-center text-sm text-[#666666] font-sans">
        Already have an account?{' '}
        <Link to="/login" className="text-[#D4A65A] font-semibold hover:underline hover:text-[#C29549] transition-colors">
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;

