import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from './AuthContext';

const NotesContext = createContext(null);

export const NotesProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // State with clear and meaningful names
  const [notesList, setNotesList] = useState([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);
  const [notesErrorMessage, setNotesErrorMessage] = useState(null);

  // Filters state
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedFilterTag, setSelectedFilterTag] = useState('');
  const [isPinnedFilterActive, setIsPinnedFilterActive] = useState(false);
  const [availableTagsList, setAvailableTagsList] = useState([]);

  // Modal editor state
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNoteData, setEditingNoteData] = useState(null);

  // Fetch all user tags for sidebar categories
  const fetchAvailableTags = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const response = await axiosClient.get('/notes/tags/all');
      if (response.data.success) {
        setAvailableTagsList(response.data.tags || []);
      }
    } catch (error) {
      console.error('Failed to load user tags:', error);
    }
  }, [isAuthenticated]);

  // Fetch notes from backend using Axios
  const fetchNotes = useCallback(async () => {
    if (!isAuthenticated) {
      setNotesList([]);
      return;
    }

    setIsLoadingNotes(true);
    setNotesErrorMessage(null);

    try {
      const queryParams = new URLSearchParams();
      if (searchKeyword.trim()) {
        queryParams.append('search', searchKeyword.trim());
      }
      if (selectedFilterTag) {
        queryParams.append('tag', selectedFilterTag);
      }
      if (isPinnedFilterActive) {
        queryParams.append('isPinned', 'true');
      }

      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response = await axiosClient.get(`/notes${queryString}`);

      if (response.data.success) {
        setNotesList(response.data.notes || []);
      }
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      setNotesErrorMessage(
        error.response?.data?.message || 'Unable to retrieve your notes. Please check connection.'
      );
    } finally {
      setIsLoadingNotes(false);
    }
  }, [isAuthenticated, searchKeyword, selectedFilterTag, isPinnedFilterActive]);

  // Automatically refresh notes and tags whenever authentication or filters change
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotes();
      fetchAvailableTags();
    }
  }, [isAuthenticated, searchKeyword, selectedFilterTag, isPinnedFilterActive, fetchNotes, fetchAvailableTags]);

  // Create note
  const createNewNote = async (notePayload) => {
    try {
      const response = await axiosClient.post('/notes', notePayload);
      if (response.data.success) {
        setNotesList((prevNotes) => [response.data.note, ...prevNotes]);
        fetchAvailableTags();
        return { success: true, note: response.data.note };
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to create note';
      return { success: false, message: errorMsg };
    }
  };

  // Update note
  const updateExistingNote = async (noteId, updatedFields) => {
    try {
      const response = await axiosClient.put(`/notes/${noteId}`, updatedFields);
      if (response.data.success) {
        setNotesList((prevNotes) =>
          prevNotes.map((note) => (note._id === noteId ? response.data.note : note))
        );
        fetchAvailableTags();
        return { success: true, note: response.data.note };
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to update note';
      return { success: false, message: errorMsg };
    }
  };

  // Delete note
  const deleteNoteById = async (noteId) => {
    try {
      const response = await axiosClient.delete(`/notes/${noteId}`);
      if (response.data.success) {
        setNotesList((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
        fetchAvailableTags();
        return { success: true };
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to delete note';
      return { success: false, message: errorMsg };
    }
  };

  // Toggle pin status
  const toggleNotePinStatus = async (noteId) => {
    try {
      const response = await axiosClient.patch(`/notes/${noteId}/pin`);
      if (response.data.success) {
        const updated = response.data.note;
        setNotesList((prevNotes) => {
          const updatedList = prevNotes.map((note) => (note._id === noteId ? updated : note));
          // Keep pinned notes at the top
          return updatedList.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
        });
        return { success: true };
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to pin/unpin note';
      return { success: false, message: errorMsg };
    }
  };

  // Modal helpers
  const openCreateModal = () => {
    setEditingNoteData(null);
    setIsNoteModalOpen(true);
  };

  const openEditModal = (note) => {
    setEditingNoteData(note);
    setIsNoteModalOpen(true);
  };

  const closeModal = () => {
    setIsNoteModalOpen(false);
    setEditingNoteData(null);
  };

  const value = {
    notesList,
    isLoadingNotes,
    notesErrorMessage,
    searchKeyword,
    setSearchKeyword,
    selectedFilterTag,
    setSelectedFilterTag,
    isPinnedFilterActive,
    setIsPinnedFilterActive,
    availableTagsList,
    isNoteModalOpen,
    editingNoteData,
    openCreateModal,
    openEditModal,
    closeModal,
    fetchNotes,
    createNewNote,
    updateExistingNote,
    deleteNoteById,
    toggleNotePinStatus,
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};
