import { useEffect, useState } from 'react';
import './App.css';
import FolderComponent from './components/folderComponent';
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
        <NoteComponent key={openedNote.idNote} note={openedNote} />
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

