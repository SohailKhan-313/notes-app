import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';
import { useNotes } from '../context/NotesContext';
import { Pin, Plus, Search, FileText, AlertCircle } from 'lucide-react';

const DashboardPage = () => {
  const {
    notesList,
    isLoadingNotes,
    notesErrorMessage,
    searchKeyword,
    selectedFilterTag,
    isPinnedFilterActive,
    openCreateModal,
  } = useNotes();

  // Separate pinned vs standard notes for natural layout when viewing all
  const isFiltered = Boolean(searchKeyword || selectedFilterTag || isPinnedFilterActive);
  const pinnedNotes = notesList.filter((n) => n.isPinned);
  const standardNotes = notesList.filter((n) => !n.isPinned);

  const renderContentHeader = () => {
    let title = 'All Notes';
    let subtitle = 'Capture and organize your daily insights and ideas';

    if (searchKeyword) {
      title = `Search results for "${searchKeyword}"`;
      subtitle = `Found ${notesList.length} matching notes`;
    } else if (selectedFilterTag) {
      title = `Tag: #${selectedFilterTag}`;
      subtitle = `Showing notes labeled with #${selectedFilterTag}`;
    } else if (isPinnedFilterActive) {
      title = 'Pinned Notes';
      subtitle = 'Your prioritized and bookmarked notes';
    }

    return (
      <header className="content-header">
        <div>
          <h1 className="content-heading">
            <span>{title}</span>
            <span className="sidebar-count-badge" style={{ fontSize: '1rem', verticalAlign: 'middle' }}>
              {notesList.length}
            </span>
          </h1>
          <p className="content-subheading">{subtitle}</p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={openCreateModal}
        >
          <Plus size={18} />
          <span>New Note</span>
        </button>
      </header>
    );
  };

  return (
    <div className="app-container">
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar />

        <main className="main-content">
          {renderContentHeader()}

          {notesErrorMessage && (
            <div className="error-alert">
              <AlertCircle size={18} />
              <span>{notesErrorMessage}</span>
            </div>
          )}

          {isLoadingNotes ? (
            <div className="empty-state" style={{ borderStyle: 'none' }}>
              <div className="spinner" style={{ width: '32px', height: '32px', borderWidth: '3px' }}></div>
              <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading your notes...</p>
            </div>
          ) : notesList.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                {searchKeyword ? <Search size={28} /> : <FileText size={28} />}
              </div>
              <h2 className="empty-state-title">
                {searchKeyword
                  ? 'No notes match your search'
                  : selectedFilterTag
                  ? `No notes tagged #${selectedFilterTag}`
                  : 'No notes yet'}
              </h2>
              <p className="empty-state-desc">
                {searchKeyword
                  ? 'Try searching with different keywords or clear your search query.'
                  : selectedFilterTag
                  ? 'There are currently no notes with this tag.'
                  : 'Begin by capturing your first thought, meeting note, snippet, or list.'}
              </p>
              {!searchKeyword && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={openCreateModal}
                >
                  <Plus size={18} />
                  <span>Create Your First Note</span>
                </button>
              )}
            </div>
          ) : isFiltered ? (
            // Single unified grid when filtering
            <div className="notes-grid">
              {notesList.map((note) => (
                <NoteCard key={note._id} note={note} />
              ))}
            </div>
          ) : (
            // Partitioned view: Pinned section + Other notes section
            <div>
              {pinnedNotes.length > 0 && (
                <section className="notes-section">
                  <h2 className="section-subtitle">
                    <Pin size={15} />
                    <span>PINNED NOTES ({pinnedNotes.length})</span>
                  </h2>
                  <div className="notes-grid">
                    {pinnedNotes.map((note) => (
                      <NoteCard key={note._id} note={note} />
                    ))}
                  </div>
                </section>
              )}

              {standardNotes.length > 0 && (
                <section className="notes-section">
                  {pinnedNotes.length > 0 && (
                    <h2 className="section-subtitle">
                      <FileText size={15} />
                      <span>OTHER NOTES ({standardNotes.length})</span>
                    </h2>
                  )}
                  <div className="notes-grid">
                    {standardNotes.map((note) => (
                      <NoteCard key={note._id} note={note} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </main>
      </div>

      <NoteModal />
    </div>
  );
};

export default DashboardPage;
