/*import type { Folder } from '../types/Folder';
import type { Note } from '../types/Note';
import type { MenuContextuelProps } from './menuContextuelComponent';
import MenuContextuelComponent from './menuContextuelComponent';
import {useEffect, useState } from 'react';
import OpenNoteComponent from './openNoteComponent';
import SpiderImage from "../assets/Spider.png";
import {getFolderChildreen} from '../service/SpookyService';



import './FolderComponent.css';

//melange des types pour faire fonctionner le map
export type Item = Folder | Note;

interface Props {
    folderInfo: Folder;
    foldersAndNotes: Item[];
}





export default function FolderComponent({folderInfo, foldersAndNotes}: Props)  {
    const [childfoldersAndNotes, setChildFoldersAndNotes] = useState<Item[]>([]);
    /*const [childfoldersAndNotes, setChildFoldersAndNotes] = useState<Item[]>([
        { idFolder: 1, nameFolder: "Work", idParent: 0 },
        { idFolder: 2, nameFolder: "Personal", idParent: 0 },
        { idNote: 1, nameNote: "Meeting Notes", contentNote: "Discuss project timeline", creationDateNote: new Date(), lastModificationNote: new Date(), idFolder: 1 },
    ]);*/

   /* const [spiderLeft, setSpiderLeft] = useState<number>(0);
    const [folderOpen, setFolderOpen] = useState<boolean>(false);
    const [menuContextuel, setMenuContextuel] = useState<MenuContextuelProps | null>(null);


    /*------------------------------UseEffect--------------------------------*/
    useEffect(() => {
        setSpiderLeft(5 + Math.random() * 100);
        console.log(spiderLeft);
    }, []);

    /*------------------------------Fonction--------------------------------*/

    function fetchChildItems(){
        getFolderChildreen(folderInfo.idFolder).then((items : Item[]) => {
            setChildFoldersAndNotes([...items]);
            console.log(childfoldersAndNotes);
        });
    }
    
    function openFolder(){
        setFolderOpen(!folderOpen);
        if (childfoldersAndNotes.length > 0) {
            return;
        }
        fetchChildItems();
        
        
    }

    /*-------------------------------Event---------------------------------*/

    const handleRightClick = (event) => {
        event.preventDefault(); // Empêche le menu contextuel par défaut
        if (menuContextuel) {
            return; // Si le menu est déjà ouvert, ne rien faire
        }
        
        setMenuContextuel({
            position: { x: event.pageX - 10, y: event.pageY - 10},
            actions: [
            { label: "Renommer TMP", onClick: () => console.log("Renommer") },
            { label: "Supprimer TMP", onClick: () => console.log("Supprimer") },
            { label: "Ajouté sous dossier", onClick: () => console.log("Propriétés") },
            { label: "Ajouté sous dossier", onClick: () => console.log("Propriétés") },
            ],
            onClose: () => setMenuContextuel(null)
        });

    };



    return (
    
    <div className="FolderComponent">

        {menuContextuel && (
        <MenuContextuelComponent
            position={menuContextuel.position}
            actions={menuContextuel.actions}
            onClose={() => setMenuContextuel(null)}
        />
        )}

        <h2 
            onClick={() => openFolder()} 
            onContextMenu={handleRightClick}
            className={folderOpen ? "FolderOpen" : "FolderClosed"}
        >

            {folderOpen ? "📂" : "📁"} {folderInfo.nameFolder}
        </h2>
        <img style={{left: `${spiderLeft}px`}} src={SpiderImage} alt="Image à déplacer" className="MonsterImage" />
        
        
        {folderOpen && childfoldersAndNotes.map((item : Item) => {
                if ("nameFolder" in item) {
                    let folder = item as Folder;
                    return <FolderComponent folderInfo={folder} foldersAndNotes={childfoldersAndNotes} />;
                }else{
                    let note = item as Note;
                    return <OpenNoteComponent note={note} />;
                }
            }
        )}
    </div>
  )
}*/



import { useState } from 'react';
import { useSpooky } from '../contexts/SpookyContext';
import type { Folder } from '../types/Folder';
import type { Note } from '../types/Note';
import SpiderImage from '../assets/Spider.png'; // ton image Halloween
import './FolderComponent.css';

interface Props {
  folderInfo: Folder;
}

export default function FolderComponent({ folderInfo }: Props) {
  const { setOpenedNote, addNote, removeFolder } = useSpooky();
  const [isOpen, setIsOpen] = useState(false);

  const toggleFolder = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="FolderComponent">
      {/* Titre du dossier */}
      <h2
        className={isOpen ? 'FolderOpen' : 'FolderClosed'}
        onClick={toggleFolder}
      >
        {isOpen ? '📂' : '📁'} {folderInfo.nameFolder}
      </h2>

      {/* Image Halloween */}
      <img src={SpiderImage} alt="Spider" className="MonsterImage" />

      {/* Boutons d'action */}
      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => addNote(folderInfo.idFolder, 'Nouvelle Note', '')}>
          ➕ Ajouter note
        </button>
        <button onClick={() => removeFolder(folderInfo.idFolder)}>🗑 Supprimer dossier</button>
      </div>

      {/* Affichage des notes si le dossier est ouvert */}
      {isOpen && (
        <div style={{ marginLeft: '20px' }}>
          {(folderInfo.notes ?? []).length > 0 ? (
            folderInfo.notes.map((note: Note) => (
              <div
                key={`note-${note.idNote}`}
                onClick={() => setOpenedNote(note)}
                style={{ cursor: 'pointer', marginBottom: '5px' }}
              >
                📝 {note.nameNote}
              </div>
            ))
          ) : (
            <p>Aucune note dans ce dossier</p>
          )}
        </div>
      )}
    </div>
  );
}

