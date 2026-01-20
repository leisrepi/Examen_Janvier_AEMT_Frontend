/*import { useState } from 'react'
import './App.css'

import type { Item } from './components/folderComponent';
import FolderComponent from './components/folderComponent';
import NoteComponent from './components/NoteComponent';
import type { Note } from './types/Note';



function App() {
  const [foldersAndNotes, setFoldersAndNotes] = useState<Item[]>([]);
  /*const [foldersAndNotes, setFoldersAndNotes] = useState<Item[]>([
    { idFolder: 1, nameFolder: "Work", idParent: 0 },
    { idFolder: 2, nameFolder: "Personal", idParent: 0 },
    { idNote: 1, nameNote: "Meeting Notes", contentNote: "Discuss project timeline", creationDateNote: new Date(), lastModificationNote: new Date(), idFolder: 1 },
  ]);*/

 /* const rootFolder = { idFolder: 2, nameFolder: "Root", idParent: null };
  
  const[openedNote, setOpenedNote] = useState<Note | null>(null);

  return (
    <>
    <div className='MainDiv'>
      <div className='ExplorerDiv'>
        <FolderComponent folderInfo={rootFolder} foldersAndNotes={foldersAndNotes}/>
      </div>
      
      {openedNote && <NoteComponent note={openedNote} />}
      {!openedNote && <div className='OpenedNote'>Aucune note ouverte</div>}
    </div>
    </>
  )
}
  export default App

*/

// src/App.tsx

// src/App.tsx


import { useEffect, useState } from 'react';
import './App.css';
import FolderComponent from './components/FolderComponent';
import NoteComponent from './components/NoteComponent';
import { SpookyProvider, useSpooky } from './contexts/SpookyContext';
import type { Item } from './service/SpookyService';
import OpenNoteComponent from './components/openNoteComponent';
import type { Note } from './types/Note';
import type { Folder } from './types/Folder';
import { getAllFolders } from './service/SpookyService';


function AppContent() {
  const {openedNote} = useSpooky();
  const [foldersAndNotes, setFoldersAndNotes] = useState<Item[]>([]);


  useEffect(() => {
    getAllFolders().then((items : Item[]) => {
        setFoldersAndNotes([...items]);
        console.log(foldersAndNotes);
    });
  }, []);
  

  return (
    <div className="MainDiv">
      {/* Barre latérale */}
      <div className="ExplorerDiv">
        <h2>Explorateur</h2>
        
        {foldersAndNotes.map((item : Item) => {
          if ("nameFolder" in item) {
              let folder = item as Folder;
              return <FolderComponent folderInfo={folder}/>;
          }else{
              let note = item as Note;
              return <OpenNoteComponent note={note} />;
          }
        })}
      </div>

      {/* Zone de contenu */}
      <div className="OpenedNote">
        {openedNote ? (
          <NoteComponent note={openedNote} />
        ) : (
          <p>Aucune note ouverte</p>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <SpookyProvider>
      <AppContent />
    </SpookyProvider>
  );
}
