import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [emailAddress, setEmailAddress] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  const { login, isAuthenticated, authErrorMessage, clearAuthError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
    clearAuthError();
  }, [isAuthenticated, navigate, redirectPath]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!emailAddress || !passwordInput) return;

    setIsSubmittingLogin(true);
    const result = await login(emailAddress, passwordInput);
    setIsSubmittingLogin(false);

    if (result.success) {
      navigate(redirectPath, { replace: true });
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo-badge">
            <FileText size={28} />
          </div>
          <h1 className="auth-title">Welcome to NoteNest</h1>
          <p className="auth-subtitle">Sign in to access your secured thoughts and ideas</p>
        </div>

        {authErrorMessage && (
          <div className="error-alert">
            <AlertCircle size={18} />
            <span>{authErrorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit}>
          <div className="form-group">
            <label htmlFor="login-email-input" className="form-label">
              Email Address
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
              <input
                id="login-email-input"
                type="email"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="name@example.com"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label htmlFor="login-password-input" className="form-label">
              Password
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
              <input
                id="login-password-input"
                type="password"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            id="login-submit-button"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem' }}
            disabled={isSubmittingLogin}
          >
            {isSubmittingLogin ? (
              <>
                <span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></span>
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <span>Don't have an account?</span>
          <Link to="/register" className="auth-link">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
