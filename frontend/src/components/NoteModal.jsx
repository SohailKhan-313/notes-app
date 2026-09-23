import React, { useState, useEffect } from 'react';
import { useNotes } from '../context/NotesContext';
import { X, Check, Tag, Palette, Pin } from 'lucide-react';

const COLOR_PRESETS = [
  { id: 'indigo', hex: '#6366f1', label: 'Indigo' },
  { id: 'violet', hex: '#8b5cf6', label: 'Violet' },
  { id: 'emerald', hex: '#10b981', label: 'Emerald' },
  { id: 'amber', hex: '#f59e0b', label: 'Amber' },
  { id: 'rose', hex: '#f43f5e', label: 'Rose' },
  { id: 'cyan', hex: '#06b6d4', label: 'Cyan' },
  { id: 'slate', hex: '#64748b', label: 'Slate' },
];

const NoteModal = () => {
  const {
    isNoteModalOpen,
    editingNoteData,
    closeModal,
    createNewNote,
    updateExistingNote,
  } = useNotes();

  // Meaningful state variables
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteTagsInput, setNoteTagsInput] = useState('');
  const [selectedColor, setSelectedColor] = useState('#6366f1');
  const [isNotePinned, setIsNotePinned] = useState(false);
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [modalErrorMessage, setModalErrorMessage] = useState(null);

  // Sync form inputs when modal opens or active note changes
  useEffect(() => {
    if (editingNoteData) {
      setNoteTitle(editingNoteData.title || '');
      setNoteContent(editingNoteData.content || '');
      setNoteTagsInput(editingNoteData.tags ? editingNoteData.tags.join(', ') : '');
      setSelectedColor(editingNoteData.color || '#6366f1');
      setIsNotePinned(Boolean(editingNoteData.isPinned));
    } else {
      // Defaults for brand new note
      setNoteTitle('');
      setNoteContent('');
      setNoteTagsInput('');
      setSelectedColor('#6366f1');
      setIsNotePinned(false);
    }
    setModalErrorMessage(null);
  }, [editingNoteData, isNoteModalOpen]);

  if (!isNoteModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!noteTitle.trim()) {
      setModalErrorMessage('Please enter a note title.');
      return;
    }
    if (!noteContent.trim()) {
      setModalErrorMessage('Please enter note content.');
      return;
    }

    setIsSubmittingNote(true);
    setModalErrorMessage(null);

    const payload = {
      title: noteTitle.trim(),
      content: noteContent.trim(),
      tags: noteTagsInput,
      color: selectedColor,
      isPinned: isNotePinned,
    };

    let result;
    if (editingNoteData) {
      result = await updateExistingNote(editingNoteData._id, payload);
    } else {
      result = await createNewNote(payload);
    }

    setIsSubmittingNote(false);

    if (result.success) {
      closeModal();
    } else {
      setModalErrorMessage(result.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {editingNoteData ? 'Edit Note' : 'Create New Note'}
          </h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={closeModal}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {modalErrorMessage && (
          <div className="error-alert">
            <span>{modalErrorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Note Title */}
          <div className="form-group">
            <label htmlFor="note-title-input" className="form-label">
              Title
            </label>
            <input
              id="note-title-input"
              type="text"
              className="form-input"
              placeholder="e.g. Project Architecture Roadmap"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              maxLength={120}
              autoFocus
            />
          </div>

          {/* Note Content */}
          <div className="form-group">
            <label htmlFor="note-content-input" className="form-label">
              Content
            </label>
            <textarea
              id="note-content-input"
              className="form-textarea"
              placeholder="Jot down your thoughts, markdown notes, code snippets, or lists..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              rows={6}
            />
          </div>

          {/* Color Selector */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Palette size={14} /> Color Accent
            </label>
            <div className="color-picker-row">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={`color-option ${selectedColor === preset.hex ? 'selected' : ''}`}
                  style={{ backgroundColor: preset.hex }}
                  onClick={() => setSelectedColor(preset.hex)}
                  title={preset.label}
                  aria-label={preset.label}
                />
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="form-group">
            <label htmlFor="note-tags-input" className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Tag size={14} /> Tags (comma separated)
            </label>
            <input
              id="note-tags-input"
              type="text"
              className="form-input"
              placeholder="e.g. Work, Ideas, React"
              value={noteTagsInput}
              onChange={(e) => setNoteTagsInput(e.target.value)}
            />
          </div>

          {/* Pin to Top Checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              id="pin-note-checkbox"
              checked={isNotePinned}
              onChange={(e) => setIsNotePinned(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
            />
            <label htmlFor="pin-note-checkbox" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Pin size={15} /> Pin this note to top
            </label>
          </div>

          {/* Modal Footer Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeModal}
              disabled={isSubmittingNote}
            >
              Cancel
            </button>
            <button
              type="submit"
              id="save-note-button"
              className="btn btn-primary"
              disabled={isSubmittingNote}
            >
              {isSubmittingNote ? (
                <>
                  <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></span>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check size={18} />
                  <span>{editingNoteData ? 'Save Changes' : 'Create Note'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;
