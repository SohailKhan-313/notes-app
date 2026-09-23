import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, User, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isSubmittingRegister, setIsSubmittingRegister] = useState(false);

  const { register, isAuthenticated, authErrorMessage, clearAuthError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
    clearAuthError();
  }, [isAuthenticated, navigate]);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (passwordInput.length < 6) {
      setValidationError('Password must be at least 6 characters long.');
      return;
    }

    if (passwordInput !== confirmPasswordInput) {
      setValidationError('Passwords do not match. Please verify.');
      return;
    }

    setIsSubmittingRegister(true);
    const result = await register(fullName, emailAddress, passwordInput);
    setIsSubmittingRegister(false);

    if (result.success) {
      navigate('/', { replace: true });
    }
  };

  const displayedError = validationError || authErrorMessage;

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo-badge">
            <FileText size={28} />
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join NoteNest to organize your thoughts effortlessly</p>
        </div>

        {displayedError && (
          <div className="error-alert">
            <AlertCircle size={18} />
            <span>{displayedError}</span>
          </div>
        )}

        <form onSubmit={handleRegisterSubmit}>
          <div className="form-group">
            <label htmlFor="register-name-input" className="form-label">
              Full Name
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
              <input
                id="register-name-input"
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="register-email-input" className="form-label">
              Email Address
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
              <input
                id="register-email-input"
                type="email"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="name@example.com"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="register-password-input" className="form-label">
              Password
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
              <input
                id="register-password-input"
                type="password"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Minimum 6 characters"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label htmlFor="register-confirm-password-input" className="form-label">
              Confirm Password
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
              <input
                id="register-confirm-password-input"
                type="password"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Repeat your password"
                value={confirmPasswordInput}
                onChange={(e) => setConfirmPasswordInput(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            id="register-submit-button"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem' }}
            disabled={isSubmittingRegister}
          >
            {isSubmittingRegister ? (
              <>
                <span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></span>
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Get Started</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <span>Already have an account?</span>
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
