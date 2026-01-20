import { useState } from "react";
import type  { Note } from "../types/Note";
import MenuContextuelComponent from "./MenuContextuelComponent";
import type { MenuContextuelProps } from "./MenuContextuelComponent";

interface Props {
    note: Note;
}




export default function OpenNoteComponent({note}: Props) {

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
            { label: "Renommer TMP", onClick: () => console.log("Renommer") },
            { label: "Supprimer TMP", onClick: () => console.log("Supprimer") },
            { label: "Ajouté sous dossier", onClick: () => console.log("Propriétés") },
            { label: "Ajouté sous dossier", onClick: () => console.log("Propriétés") },
            ],
            onClose: () => setMenuContextuel(null)
        });

    };


  return (
    <div className="OpenNoteComponent">
        <h3 onContextMenu={handleRightClick}>🗒️ {note.nameNote}</h3>
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