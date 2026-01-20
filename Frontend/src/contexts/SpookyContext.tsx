
// src/context/SpookyContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createFolder,
  createNote,
  updateNote,
  deleteNote,
  deleteFolder,
} from '../service/SpookyService';
import type { Note } from '../types/Note';

interface SpookyContextType {
  openedNote: Note | null;
  setOpenedNote: (note: Note | null) => void;
  addFolder: (name: string) => Promise<void>;
  removeFolder: (id: number) => Promise<void>;
  addNote: (folderId: number, nameNote: string, contentNote: string) => Promise<void>;
  updateExistingNote: (note: Note) => Promise<void>;
  removeNote: (id: number) => Promise<void>;
}

export const SpookyContext = createContext<SpookyContextType | undefined>(undefined);

export const SpookyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [openedNote, setOpenedNote] = useState<Note | null>(null);

  const addFolder = async (name: string) => {
    await createFolder(name);
  };

  const removeFolder = async (id: number) => {
    await deleteFolder(id);
  };

  const addNote = async (folderId: number, nameNote: string, contentNote: string) => {
    await createNote(folderId, nameNote, contentNote);
  };

  const updateExistingNote = async (note: Note) => {
    await updateNote(note);
  };

  const removeNote = async (id: number) => {
    await deleteNote(id);
  };

  return (
    <SpookyContext.Provider
      value={{
        openedNote,
        setOpenedNote,
        addFolder,
        removeFolder,
        addNote,
        updateExistingNote,
        removeNote,
      }}
    >
      {children}
    </SpookyContext.Provider>
  );
};

export const useSpooky = () => {
  const context = useContext(SpookyContext);
  if (!context) throw new Error('useSpooky doit être utilisé dans SpookyProvider');
  return context;
};
