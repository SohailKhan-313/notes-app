import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div className="empty-state-icon" style={{ margin: '0 auto 1.5rem auto' }}>
          <FileQuestion size={32} />
        </div>
        <h1 className="auth-title">404 - Page Not Found</h1>
        <p className="auth-subtitle" style={{ marginBottom: '2rem' }}>
          The page you are looking for doesn't exist or has been relocated.
        </p>
        <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex' }}>
          <ArrowLeft size={18} />
          <span>Back to Workspace</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
