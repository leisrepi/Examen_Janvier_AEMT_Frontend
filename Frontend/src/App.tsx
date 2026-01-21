import { useContext, useEffect, useState } from 'react';
import './App.css';
import FolderComponent from './components/folderComponent';
import NoteComponent from './components/NoteComponent';
import { SpookyContext, SpookyProvider, useSpooky } from './contexts/SpookyContext';
import type { Item } from './service/SpookyService';
import OpenNoteComponent from './components/openNoteComponent';
import type { Note } from './types/Note';
import type { Folder } from './types/Folder';
import { createNote, createFolder,  getAllFolders } from './service/SpookyService';
import type { MenuContextuelProps } from './components/MenuContextuelComponent';
import MenuContextuelComponent from './components/MenuContextuelComponent';
import BandeauComponent from './components/bandeau/BandeauComponent';
import Background from './assets/background_wip.png';


function AppContent() {
  const {openedNote} = useSpooky();
  const [foldersAndNotes, setFoldersAndNotes] = useState<Item[]>([]);
  const [menuContextuel, setMenuContextuel] = useState<MenuContextuelProps | null>(null);

  const spookyContext = useContext(SpookyContext);
  if (!spookyContext) return null; // Sécurité si le contexte est null
  //TODO mettre le menu contextuel dans le contexte pour l'utiliser partout

  function fetchChildItems(){
    getAllFolders().then((items : Item[]) => {
        setFoldersAndNotes([...items]);
        console.log(foldersAndNotes);
    });
  }

  useEffect(() => {
    fetchChildItems();
  }, []);
  
  const handleRightClickExplorerDiv = (event) => {
    event.preventDefault(); // Empêche le menu contextuel par défaut
    console.log("right click explorer div");
    if (menuContextuel) {
      return; // Si le menu est déjà ouvert, ne rien faire
    }
    
    setMenuContextuel({
      position: { x: event.pageX - 10, y: event.pageY - 10},
      actions: [
        { label: "Ajouté sous dossier", onClick: () => createFolder(null).then(() => fetchChildItems()) },
        { label: "Ajouté note", onClick: () => alert("A modifier : en attende du backend, code deja écris et en commantaire sur la meme ligne que cette alert") /*createNote(0 , "", "").then(() => fetchChildItems())*/ },
      ],
      onClose: () => setMenuContextuel(null)
    });

  };
  return (
    
    <div className="MainDiv">
      <div>
        <BandeauComponent/>
      </div>

      {menuContextuel && (
      <MenuContextuelComponent
          position={menuContextuel.position}
          actions={menuContextuel.actions}
          onClose={() => setMenuContextuel(null)}
      />)}

      {/* Barre latérale */}
      <div className="ExplorerDiv">
        <h2 className='explorateurTitle' onContextMenu={handleRightClickExplorerDiv}>Explorateur</h2>
        
        <div className="explorerContent">
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
      </div>

      {/* Zone de contenu */}
      
    <div className="OpenedNote">
      {openedNote ? (
        <NoteComponent key={openedNote.idNote} note={openedNote} updateParent={spookyContext.updateNoteParentFolder} />
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

