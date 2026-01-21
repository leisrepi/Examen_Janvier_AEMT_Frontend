import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  getAllFolders,
  createFolder,
  createNote,
  updateNote,
  deleteNote,
  deleteFolder,
} from '../service/SpookyService';
import type { Folder } from '../types/Folder';
import type { Note } from '../types/Note';


interface SpookyContextType {
  folders: Folder[];
  openedNote: Note | null;
  setOpenedNote: (note: Note | null) => void;
  refreshFolders: () => Promise<void>;
  registerExplorerRefresh: (fn: () => void) => void;
  refreshExplorer: () => void;
  addFolder: (parentId: number) => Promise<void>; 
  removeFolder: (id: number) => Promise<void>;
  addNote: (folderId: number, nameNote: string, contentNote: string) => Promise<void>;
  updateExistingNote: (note: Note) => Promise<void>;
  setUpdateNoteParentFolder: (fn: () => void) => void;
  updateNoteParentFolder: () => void;
  removeNote: (id: number) => Promise<void>;
}



export const SpookyContext = createContext<SpookyContextType | undefined>(undefined);

export const SpookyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [openedNote, setOpenedNote] = useState<Note | null>(null);
  const explorerRefreshRef = useRef<() => void>(() => {});


  const updateNoteParentFolderRef = useRef<() => void>(() => {});

  const setUpdateNoteParentFolder = (fn: () => void) => {
    updateNoteParentFolderRef.current = fn;
  };

  const updateNoteParentFolder = () => {
    updateNoteParentFolderRef.current();
  };

  const registerExplorerRefresh = (fn: () => void) => {
    explorerRefreshRef.current = fn;
  };

  const refreshExplorer = () => {
    explorerRefreshRef.current();
  };

  const refreshFolders = async () => {
    try {
      const data = await getAllFolders();
      setFolders(data);
    } catch (error) {
      console.error('Erreur lors du chargement des dossiers :', error);
    }
  };

  useEffect(() => {
    refreshFolders();
  }, []);
const addFolder = async (parentId: number) => {
  await createFolder(parentId); 
  await refreshFolders();
};

  /*const addFolder = async (name: string) => {
    await createFolder(name);
    await refreshFolders();
  };
*/
  const removeFolder = async (id: number) => {
    await deleteFolder(id);
    await refreshFolders();
  };

  const addNote = async (folderId: number, nameNote: string, contentNote: string) => {
    await createNote(folderId, nameNote, contentNote);
    await refreshFolders();
  };

  const updateExistingNote = async (note: Note) => {
    await updateNote(note);
    await refreshFolders();
  };

  const removeNote = async (id: number) => {
    await deleteNote(id);
    await refreshFolders();
  };

  return (
    <SpookyContext.Provider
      value={{
        folders,
        openedNote,
        setOpenedNote,
        refreshFolders,
        registerExplorerRefresh,
        refreshExplorer,
        addFolder,
        removeFolder,
        addNote,
        updateExistingNote,
        removeNote,
        setUpdateNoteParentFolder,
        updateNoteParentFolder,
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
