import { useContext, useEffect, useState } from 'react';
import FolderComponent from '../../components/folderComponent';
import NoteComponent from '../../components/NoteComponent';
import { SpookyContext, SpookyProvider, useSpooky } from '../../contexts/SpookyContext';
import type { Item } from '../../service/SpookyService';
import OpenNoteComponent from '../../components/openNoteComponent';
import type { Note } from '../../types/Note';
import type { Folder } from '../../types/Folder';
import { createNote, createFolder, getAllFolders, getNoteById, getFolderById} from '../../service/SpookyService';
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
  const [childIdForAutoOpenDestinedToChildreen, setChildIdForAutoOpenDestinedToChildreen] = useState<Number[]>([]);

  const spookyContext = useContext(SpookyContext);
  if (!spookyContext) return null; // Security if context is not available

  function fetchChildItems(){
    getAllFolders().then((items : Item[]) => {
        setFoldersAndNotes([...items]);
        console.log(foldersAndNotes);
    });
  }

  async function openFolderTree(actualOpenNote : Note){
    /*open the childreen folder : */
    /*getting all the parent : */
    if (!actualOpenNote) {console.log("no note open"); return}

    let chilId = [Number(actualOpenNote.idFolder)];
    let parentFolder : Folder;
    let nextId : number | null =  Number(actualOpenNote.idFolder);
    //console.log("next id ", nextId);
    do{
      
      parentFolder = await getFolderById(nextId);
      nextId = parentFolder.idParent;
      //console.log("next id ", nextId);
      if (nextId){
        chilId.unshift(nextId);
      }
    }while (nextId != null);
    console.log(chilId.toString());
    setChildIdForAutoOpenDestinedToChildreen(chilId);
  }

  useEffect(() => {
    fetchChildItems();
    if (id) {
      getNoteById(Number(id)).then((note: Note) => {
        spookyContext.setOpenedNote(note);
        openFolderTree(note);
      });
    }
  }, []);
  
  const handleRightClickExplorerDiv = (event) => {
    event.preventDefault(); //  Prevents the default context menu
    console.log("right click explorer div");
    if (menuContextuel) {
      return; // If menu is already open, do nothing
    }
    
    setMenuContextuel({
      position: { x: event.pageX - 10, y: event.pageY - 10},
      actions: [
        { label: "Ajouter un dossier", onClick: () => createFolder(null).then(() => fetchChildItems()) },
        { label: "Ajouter une note", onClick: () => createNote(null , "", "").then(() => fetchChildItems()) },
        { label: "Allez a la Morgue (corbeille)", onClick: () => navigate('/bin') },
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

      
      {/*Sidebar*/}
      <div className="ExplorerDiv"  onContextMenu={handleRightClickExplorerDiv} style={{ visibility: spookyContext.loadedPage === "noteView" ? "visible" : "hidden" }}>
        <h2 className='explorateurTitle'>Explorateur</h2>
        <div className="explorerContent">
          {foldersAndNotes.map((item : Item) => {
            if ("nameFolder" in item) {
                let folder = item as Folder;
                return <FolderComponent key={folder.idFolder} childIdForAutoOpen={childIdForAutoOpenDestinedToChildreen}  folderInfo={folder} updateParent={fetchChildItems}/>;
            }else{
                let note = item as Note;
                return <OpenNoteComponent key={note.idNote} note={note} updateParent={fetchChildItems} />;
            }
          })}
        </div>
      </div>

      {/* Content area */}
      
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

