import { useContext, useEffect, useState } from 'react';
import FolderComponent from '../../components/folderComponent';
import NoteComponent from '../../components/NoteComponent';
import { SpookyContext, SpookyProvider, useSpooky } from '../../contexts/SpookyContext';
import type { Item } from '../../service/SpookyService';
import OpenNoteComponent from '../../components/openNoteComponent';
import type { Note } from '../../types/Note';
import type { Folder } from '../../types/Folder';
import { createNote, createFolder, getAllFolders, getNoteById} from '../../service/SpookyService';
import type { MenuContextuelProps } from '../../components/MenuContextuelComponent';
import MenuContextuelComponent from '../../components/MenuContextuelComponent';
import BandeauComponent from '../../components/bandeau/BandeauComponent';
import { useNavigate, useParams } from 'react-router-dom';
import NoNote from '../../assets/background_no_note.png';



export function AppContent() {
  const { id } = useParams();
  const navigate = useNavigate();
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
    if (id) {
      getNoteById(Number(id)).then((note: Note) => {
        spookyContext.setOpenedNote(note);
      });
    }
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
        { label: "Ajouter Dossier", onClick: () => createFolder(null).then(() => fetchChildItems()) },
        { label: "Ajouter Note", onClick: () => createNote(null , "", "").then(() => fetchChildItems()) },
        { label: "Ouvrir Morgue", onClick: () => navigate('/bin') },
      ],
      onClose: () => setMenuContextuel(null)
    });

  };
  return (<>
    <div>
        <BandeauComponent/>
    </div>
    <div className="MainDiv">
      

      {menuContextuel && (
      <MenuContextuelComponent
          position={menuContextuel.position}
          actions={menuContextuel.actions}
          onClose={() => setMenuContextuel(null)}
      />)}

      
      {/* Barre latérale */}
      <div className="ExplorerDiv" style={{ visibility: spookyContext.loadedPage === "noteView" ? "visible" : "hidden" }}>
        <h2 className='explorateurTitle' onContextMenu={handleRightClickExplorerDiv}>Explorateur</h2>
        <div className="explorerContent">
          {foldersAndNotes.map((item : Item) => {
            if ("nameFolder" in item) {
                let folder = item as Folder;
                return <FolderComponent key={folder.idFolder} folderInfo={folder} updateParent={fetchChildItems}/>;
            }else{
                let note = item as Note;
                return <OpenNoteComponent key={note.idNote} note={note} updateParent={fetchChildItems} />;
            }
          })}
        </div>
      </div>

      {/* Zone de contenu */}
      
    <div className="OpenedNote">
      {openedNote ? (
        <NoteComponent key={openedNote.idNote} noteData={openedNote} updateParent={spookyContext.updateNoteParentFolder} />
      ) : (
        <img src={NoNote} alt="No note" style={{width: '100%', height: 'auto'}} />
      )}
    </div>
    </div>
  </>);
}

export default function App() {
  return (
    <SpookyProvider>
      <AppContent />
    </SpookyProvider>
  );
}

