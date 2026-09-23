import React from 'react';
import { useNotes } from '../context/NotesContext';
import { Pin, Edit3, Trash2, Calendar } from 'lucide-react';

const NoteCard = ({ note }) => {
  const { toggleNotePinStatus, deleteNoteById, openEditModal } = useNotes();

  const handlePinClick = (e) => {
    e.stopPropagation();
    toggleNotePinStatus(note._id);
  };

  const handleDeleteClick = async (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${note.title}"?`)) {
      await deleteNoteById(note._id);
    }
  };

  const handleCardClick = () => {
    openEditModal(note);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <article
      className="note-card"
      style={{ '--card-accent-bar': note.color || '#6366f1' }}
      onClick={handleCardClick}
    >
      <header className="note-card-header">
        <h3 className="note-card-title">{note.title}</h3>
        <button
          type="button"
          className={`pin-button ${note.isPinned ? 'pinned' : ''}`}
          onClick={handlePinClick}
          title={note.isPinned ? 'Unpin note' : 'Pin note to top'}
          aria-label={note.isPinned ? 'Unpin note' : 'Pin note'}
        >
          <Pin size={17} fill={note.isPinned ? 'currentColor' : 'none'} />
        </button>
      </header>

      <p className="note-card-content">{note.content}</p>

      {note.tags && note.tags.length > 0 && (
        <div className="note-tags-container">
          {note.tags.map((tag, idx) => (
            <span key={`${tag}-${idx}`} className="tag-badge">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <footer className="note-card-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Calendar size={13} />
          <span>{formatDate(note.updatedAt || note.createdAt)}</span>
        </div>

        <div className="note-card-actions">
          <button
            type="button"
            className="action-icon-btn"
            onClick={(e) => {
              e.stopPropagation();
              openEditModal(note);
            }}
            title="Edit note"
          >
            <Edit3 size={15} />
          </button>
          <button
            type="button"
            className="action-icon-btn delete-btn"
            onClick={handleDeleteClick}
            title="Delete note"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </footer>
    </article>
  );
};

export default NoteCard;
