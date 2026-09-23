import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../context/NotesContext';
import { FileText, Search, X, Plus, LogOut } from 'lucide-react';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { searchKeyword, setSearchKeyword, openCreateModal } = useNotes();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="navbar">
      {/* Brand logo */}
      <Link to="/" className="nav-brand">
        <div className="nav-brand-icon">
          <FileText size={20} />
        </div>
        <span>NoteNest</span>
      </Link>

      {/* Global Search */}
      <div className="nav-search">
        <Search size={18} className="nav-search-icon" />
        <input
          type="text"
          id="global-notes-search-input"
          className="nav-search-input"
          placeholder="Search by title, content, or tags..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        {searchKeyword && (
          <button
            type="button"
            className="nav-search-clear"
            onClick={() => setSearchKeyword('')}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Right Actions */}
      <div className="nav-actions">
        <button
          type="button"
          id="create-note-button"
          className="btn btn-primary"
          onClick={openCreateModal}
        >
          <Plus size={18} />
          <span>New Note</span>
        </button>

        {currentUser && (
          <div className="user-badge" title={currentUser.email}>
            <div className="user-avatar">{getInitials(currentUser.name)}</div>
            <span>{currentUser.name}</span>
          </div>
        )}

        <button
          type="button"
          id="logout-button"
          className="btn btn-secondary btn-icon-only"
          onClick={handleLogout}
          title="Sign out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
