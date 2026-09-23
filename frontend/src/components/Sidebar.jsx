import React from 'react';
import { useNotes } from '../context/NotesContext';
import { BookOpen, Pin, Tag, Layers, XCircle } from 'lucide-react';

const Sidebar = () => {
  const {
    notesList,
    selectedFilterTag,
    setSelectedFilterTag,
    isPinnedFilterActive,
    setIsPinnedFilterActive,
    availableTagsList,
  } = useNotes();

  const totalNotesCount = notesList.length;
  const pinnedNotesCount = notesList.filter((n) => n.isPinned).length;

  const handleSelectAll = () => {
    setIsPinnedFilterActive(false);
    setSelectedFilterTag('');
  };

  const handleTogglePinnedOnly = () => {
    setIsPinnedFilterActive(!isPinnedFilterActive);
    setSelectedFilterTag('');
  };

  const handleTagClick = (tag) => {
    if (selectedFilterTag === tag) {
      setSelectedFilterTag('');
    } else {
      setSelectedFilterTag(tag);
      setIsPinnedFilterActive(false);
    }
  };

  return (
    <aside className="sidebar">
      {/* Primary Views */}
      <div>
        <h4 className="sidebar-title">Views</h4>
        <ul className="sidebar-nav-list">
          <li>
            <button
              type="button"
              className={`sidebar-nav-item ${
                !isPinnedFilterActive && !selectedFilterTag ? 'active' : ''
              }`}
              onClick={handleSelectAll}
            >
              <span className="sidebar-item-label">
                <BookOpen size={18} />
                <span>All Notes</span>
              </span>
              <span className="sidebar-count-badge">{totalNotesCount}</span>
            </button>
          </li>

          <li>
            <button
              type="button"
              className={`sidebar-nav-item ${isPinnedFilterActive ? 'active' : ''}`}
              onClick={handleTogglePinnedOnly}
            >
              <span className="sidebar-item-label">
                <Pin size={18} />
                <span>Pinned</span>
              </span>
              <span className="sidebar-count-badge">{pinnedNotesCount}</span>
            </button>
          </li>
        </ul>
      </div>

      {/* Tags / Categories */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.5rem',
            paddingRight: '0.5rem',
          }}
        >
          <h4 className="sidebar-title" style={{ marginBottom: 0 }}>
            Tags ({availableTagsList.length})
          </h4>
          {selectedFilterTag && (
            <button
              type="button"
              style={{
                background: 'none',
                border: 'none',
                color: '#818cf8',
                cursor: 'pointer',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
              }}
              onClick={() => setSelectedFilterTag('')}
            >
              <XCircle size={14} /> Clear
            </button>
          )}
        </div>

        {availableTagsList.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', padding: '0.5rem' }}>
            No tags yet. Add tags when creating notes!
          </p>
        ) : (
          <div className="tags-scroll-area">
            {availableTagsList.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`sidebar-nav-item ${selectedFilterTag === tag ? 'active' : ''}`}
                onClick={() => handleTagClick(tag)}
              >
                <span className="sidebar-item-label">
                  <Tag size={15} />
                  <span>{tag}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
