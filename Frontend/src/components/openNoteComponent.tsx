
import { useState, useContext } from 'react';
import type { Note } from '../types/Note';
import MenuContextuelComponent from './MenuContextuelComponent';
import type { MenuContextuelProps } from './MenuContextuelComponent';
import { SpookyContext } from '../contexts/SpookyContext';

interface Props {
  note: Note;
}

export default function OpenNoteComponent({ note }: Props) {
  const spookyContext = useContext(SpookyContext);
  if (!spookyContext) return null;

  const [menuContextuel, setMenuContextuel] = useState<MenuContextuelProps | null>(null);

  const handleRightClick = (event: React.MouseEvent<HTMLHeadingElement>) => {
    event.preventDefault();
    if (menuContextuel) return;

    setMenuContextuel({
      position: { x: event.pageX - 10, y: event.pageY - 10 },
      actions: [
        { label: 'Renommer TMP', onClick: () => console.log('Renommer') },
        { label: 'Supprimer TMP', onClick: () => console.log('Supprimer') },
      ],
      onClose: () => setMenuContextuel(null),
    });
  };

  const openFile = () => spookyContext.setOpenedNote(note);

  return (
    <div className="OpenNoteComponent">
      <h3 onContextMenu={handleRightClick} onClick={openFile}>
        🗒️ {note.nameNote}
      </h3>
      {menuContextuel && (
        <MenuContextuelComponent
          position={menuContextuel.position}
          actions={menuContextuel.actions}
          onClose={() => setMenuContextuel(null)}
        />
      )}
    </div>
  );
}

/*import { useState } from "react";
import type  { Note } from "../types/Note";
import MenuContextuelComponent from "./MenuContextuelComponent";
import type { MenuContextuelProps } from "./MenuContextuelComponent";
import { useContext } from "react";
import {SpookyContext}  from "../contexts/SpookyContext";
import {updateNote, deleteNote} from "../service/SpookyService";

interface Props {
    note: Note;
    updateParent? : () => void;
}





export default function OpenNoteComponent({note, updateParent}: Props) {
  const spookyContext = useContext(SpookyContext);
  const [noteName, setNoteName] = useState<string>(note.nameNote);

  if (!spookyContext) return null; // Sécurité si le contexte est null

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
    const confirmDelete = window.confirm(`Êtes-vous sûr de vouloir supprimer la note "${note.nameNote}" ?`);
    if (!confirmDelete) {
      return; // L'utilisateur a annulé la suppression
    }
    if (spookyContext.openedNote?.idNote === note.idNote) {
      spookyContext.setOpenedNote(null); 
    }
    deleteNote(note.idNote).then(() => {
        // Retirer la note de l'état global ou du contexte
        alert("Note supprimée avec succès.");
        if (updateParent){
          updateParent();
        }
    });
  }
  
    //TODO afficher erreur si le nom est invalide

  //Menu contextuel
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

  const openFile = () => {
    spookyContext.setOpenedNote(note);
  }


  return (
    <div className="OpenNoteComponent">
        <h3 onContextMenu={handleRightClick} onClick={openFile}>🗒️ {noteName}</h3>
        {menuContextuel && (
          <MenuContextuelComponent
            position={menuContextuel.position}
            actions={menuContextuel.actions}
            onClose={() => setMenuContextuel(null)}
          />
        )}
    </div>
  )
}*/