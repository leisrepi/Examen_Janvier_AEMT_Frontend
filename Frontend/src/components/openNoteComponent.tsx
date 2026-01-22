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

  if (!spookyContext) return null; // Sécurité si le contexte est null

  useEffect(() => {
    setNoteName(note.nameNote);
  }, [note.nameNote]);

  useEffect(() => {
    if (spookyContext.openedNote?.idNote === note.idNote) {
      spookyContext.setUpdateNoteParentFolder(updateParent || (() => {}));
    }
  }, []);

  function renameNoteClick() {
    const newName = prompt("Entrez le nouveau nom de la note :", note.nameNote);
    if (newName && newName.trim() !== "") {
        // Appeler la fonction de mise à jour du nom de la note ici
        console.log(`Renommer la note ${note.idNote} en ${newName}`);
        // Par exemple : updateNoteName(note.idNote, newName).then(() => { ... });
        updateNote({
            ...note,
            nameNote: newName
          }).then((updatedNote) => {
            if (spookyContext.openedNote?.idNote === note.idNote) {
              spookyContext.setOpenedNote(updatedNote);
            }
            console.log(`Note renommée avec succès : `);
            console.log(updatedNote);
            note.nameNote = updatedNote.nameNote;
            setNoteName(updatedNote.nameNote);
            if (updateParent){
              updateParent();
            }
            
          });
    }
  }

  function deleteNoteClick() {
    /*const confirmDelete = window.confirm(`Êtes-vous sûr de vouloir supprimer la note "${note.nameNote}" ?`);
    if (!confirmDelete) {
      return; // L'utilisateur a annulé la suppression
    }*/
    if (spookyContext.openedNote?.idNote === note.idNote) {
      spookyContext.setOpenedNote(null); 
    }

    updateNote({
      ...note,
      toBin: true
    }).then(() => {
        if (updateParent){
          updateParent();
        }
    });

    //supprésion réelle
    /*deleteNote(note.idNote).then(() => {
        // Retirer la note de l'état global ou du contexte
        alert("Note supprimée avec succès.");
        if (updateParent){
          updateParent();
        }
    });*/
  }
  
    //TODO afficher erreur si le nom est invalide

  /*Menu contextuel*/
  const [menuContextuel, setMenuContextuel] = useState<MenuContextuelProps | null>(null);
  
  const handleRightClick = (event) => {
        event.preventDefault(); // Empêche le menu contextuel par défaut
        if (menuContextuel) {
            return; // Si le menu est déjà ouvert, ne rien faire
        }
        
        setMenuContextuel({
            position: { x: event.pageX - 10, y: event.pageY - 10},
            actions: [
            { label: "Renommer", onClick: () => renameNoteClick() },
            { label: "Supprimer", onClick: () => deleteNoteClick() },
            ],
            onClose: () => setMenuContextuel(null)
        });

    };

  const openFile = async () => {
    if (spookyContext.openedNote) {
      if (spookyContext.editNoteSaveFunction) {
        await spookyContext.editNoteSaveFunction();
        await new Promise(resolve => setTimeout(resolve, 300));
        if (updateParent) updateParent();
        spookyContext.setOpenedNote(note);
        spookyContext.setUpdateNoteParentFolder(updateParent || (() => {}));
        console.log("Saved current note before opening new one.");
      }
    }else{
      spookyContext.setOpenedNote(note);
      spookyContext.setUpdateNoteParentFolder(updateParent || (() => {}));
    }
  }


  return (
    <div className="OpenNoteComponent">
        {/* <h4 onContextMenu={handleRigOhtClick} onClick={openFile}><img className="coffinPic" src={parchment} alt="Coffin icon" /> {note.nameNote}</h4> */}
        <h4 onContextMenu={handleRightClick} onClick={openFile}><img className="parchmentPic" src={parchment} alt="Coffin icon" /> {note.nameNote}</h4>
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