import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { X, Shield, Eye, EyeOff } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setAuthModalOpen, setUser } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate auth
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser({ email });
    setAuthModalOpen(false);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setAuthModalOpen(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md card-glass p-8 fade-in">
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 text-spy-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center mx-auto mb-4">
            <Shield size={32} className="text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">
            {isSignUp ? 'Create Clearance' : 'Authenticate'}
          </h3>
          <p className="text-spy-300 text-sm mt-1">
            {isSignUp ? 'Register for classified access' : 'Enter your credentials'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-text">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="agent@classified.io"
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="label-text">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-spy-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Shield size={16} />
                {isSignUp ? 'Create Account' : 'Sign In'}
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-spy-400 mt-4">
          {isSignUp ? 'Already have clearance?' : "Don't have clearance?"}{' '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-neon-purple hover:text-neon-purple/80 transition-colors"
          >
            {isSignUp ? 'Sign In' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
};
