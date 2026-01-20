import { useState } from "react";
import type  { Note } from "../types/Note";
import MenuContextuelComponent from "./MenuContextuelComponent";
import type { MenuContextuelProps } from "./MenuContextuelComponent";
import { useContext } from "react";
import {SpookyContext}  from "../contexts/SpookyContext";
import parchment from "../assets/parchment.png";
import './OpenNoteComponent.css';

interface Props {
    note: Note;
}




export default function OpenNoteComponent({note}: Props) {
  const spookyContext = useContext(SpookyContext);

  if (!spookyContext) return null; // Sécurité si le contexte est null


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
            ],
            onClose: () => setMenuContextuel(null)
        });

    };

  const openFile = () => {
    spookyContext.setOpenedNote(note);
  }


  return (
    <div className="OpenNoteComponent">
        {/* <h4 onContextMenu={handleRightClick} onClick={openFile}><img className="coffinPic" src={parchment} alt="Coffin icon" /> {note.nameNote}</h4> */}
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