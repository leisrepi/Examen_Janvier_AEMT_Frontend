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


import './App.css';
import FolderComponent from './components/folderComponent';
import NoteComponent from './components/NoteComponent';
import { SpookyProvider, useSpooky } from './contexts/SpookyContext';

function AppContent() {
  const { folders, openedNote } = useSpooky();

  return (
    <div className="MainDiv">
      {/* Barre latérale */}
      <div className="ExplorerDiv">
        <h2>Explorateur</h2>
        {folders.length > 0 ? (
          folders.map((folder) => (
            <FolderComponent key={`folder-${folder.idFolder}`} folderInfo={folder} />
          ))
        ) : (
          <p>Aucun dossier trouvé</p>
        )}
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
