import { useState, useEffect, use} from "react";
import type  { Note } from "../types/Note";
import MenuContextuelComponent from "./MenuContextuelComponent";
import type { MenuContextuelProps } from "./MenuContextuelComponent";
import { useContext } from "react";
import {SpookyContext}  from "../contexts/SpookyContext";
import {updateNote, deleteNote} from "../service/SpookyService";

import parchment from "../assets/parchment.png";
import './OpenNoteComponent.css';

interface Props {
    note: Note;
    updateParent? : () => void;
}





export default function OpenNoteComponent({note, updateParent}: Props) {
  const spookyContext = useContext(SpookyContext);
  const [noteName, setNoteName] = useState<string>(note.nameNote);

  
  useEffect(() => {
    setNoteName(note.nameNote);
  }, [note.nameNote]);

  
  function deleteNoteClick() {
    const confirmDelete = window.confirm(`Êtes-vous sûr de vouloir supprimer la note "${note.nameNote}" ?`);
    if (!confirmDelete) {
      return; // L'utilisateur a annulé la suppression
    }
    
    //supprésion réelle
    deleteNote(note.idNote).then(() => {
        // Retirer la note de l'état global ou du contexte
        alert("Note supprimée avec succès.");
        if (updateParent){
          updateParent();
        }
    });
  }
  
  function restoreNoteClick() {
    updateNote({
      ...note,
      toBin: false
    }).then(() => {
      if (updateParent) {
        updateParent();
      }
    });
  }

  function openFolder(){
    setFolderOpen(!folderOpen);
    if (childfoldersAndNotes.length > 0) {
        return;
    }
    fetchChildItems(); 
  }

  /*Menu contextuel*/
  const [menuContextuel, setMenuContextuel] = useState<MenuContextuelProps | null>(null);
  
  const handleRightClick = (event) => {
        event.preventDefault(); // Empêche le menu contextuel par défaut
        event.stopPropagation(); 
        if (menuContextuel) {
            return; // Si le menu est déjà ouvert, ne rien faire
        }
        
        setMenuContextuel({
            position: { x: event.pageX - 10, y: event.pageY - 10},
            actions: [
            { label: "Supprimer", onClick: () => deleteNoteClick() },
            { label: "Restaurer", onClick: () => restoreNoteClick() },
            ],
            onClose: () => setMenuContextuel(null)
        });

    };

  


  return (
    <div className="OpenNoteComponent">
        {/* <h4 onContextMenu={handleRigOhtClick} onClick={openFile}><img className="coffinPic" src={parchment} alt="Coffin icon" /> {note.nameNote}</h4> */}
        <h4 onContextMenu={handleRightClick}><img className="parchmentPic" src={parchment} alt="Coffin icon" /> {note.nameNote}</h4>
        {menuContextuel && (
          <MenuContextuelComponent
            position={menuContextuel.position}
            actions={menuContextuel.actions}
            onClose={() => setMenuContextuel(null)}
          />
        )}
    </div>
  )
}
