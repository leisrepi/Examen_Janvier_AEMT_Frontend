import { useState, useEffect, use} from "react";
import type  { Note } from "../types/Note";
import MenuContextuelComponent from "./MenuContextuelComponent";
import type { MenuContextuelProps } from "./MenuContextuelComponent";
import { useContext } from "react";
import {SpookyContext}  from "../contexts/SpookyContext";
import {updateNote, moveToBin ,exportNotePdf, getNoteById} from "../service/SpookyService";

import parchment from "../assets/parchment.png";
import './OpenNoteComponent.css';

interface Props {
    note: Note;
    updateParent? : () => void;
}





export default function OpenNoteComponent({note, updateParent}: Props) {
  const spookyContext = useContext(SpookyContext);
  const [noteName, setNoteName] = useState<string>(note.nameNote);

  if (!spookyContext) return null; // Security if the context is null

  useEffect(() => {
    setNoteName(note.nameNote);
  }, [note.nameNote]);

  useEffect(() => {
    if (spookyContext.openedNote?.idNote === note.idNote) {
      spookyContext.setUpdateNoteParentFolder(updateParent || (() => {}));
    }
  }, []);

  async function remplacerLiensMarkdown(texte : string) : Promise<string> {
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    let nouveauTexte = texte;
  
    // Table for storing pledges
    const promesses = [];
  
    while ((match = regex.exec(texte)) !== null) {
      const texteLien = match[1];
      const url = match[2];
      let numero = null;
  
      if (url.startsWith("http://localhost:5173")) {
        const numMatch = url.match(/(\d+)$/);
        if (numMatch) {
          numero = parseInt(numMatch[1], 10);
  
          // Prepare the promise to replace the text
          promesses.push(
            getNoteById(numero).then(note => {
              // Replace in the original text
              nouveauTexte = nouveauTexte.replace(
                `[${texteLien}](${url})`,
                `[${note.nameNote}](${url})`
              );
            }).catch((error) => {
              console.error(`Erreur lors de la récupération de la note avec l'ID ${numero}:`, error);
              nouveauTexte = nouveauTexte.replace(
                `[${texteLien}](${url})`,
                `[Note supprimer](${url})`
              );
            })
          );
        }
      }
    }
    // Wait until all the pledges are finished
    await Promise.all(promesses);

    return nouveauTexte;
  }

  function renameNoteClick() {
    const newName = prompt("Entrez le nouveau nom de la note :", note.nameNote);
    if (newName && newName.trim() !== "") {
        // Call the note name update function here
        console.log(`Renommer la note ${note.idNote} en ${newName}`);
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
    if (spookyContext.openedNote?.idNote === note.idNote) {
      spookyContext.setOpenedNote(null); 
    }

    moveToBin(note).then(() => {
        if (updateParent){
          updateParent();
        }
    });
    

  }

  /*Context menu*/
  const [menuContextuel, setMenuContextuel] = useState<MenuContextuelProps | null>(null);
  
  const handleRightClick = (event) => {
        event.preventDefault(); 
        event.stopPropagation(); 
        if (menuContextuel) {
            return; 
        }
        
        setMenuContextuel({
            position: { x: event.pageX - 10, y: event.pageY - 10},
            actions: [
            { label: "Renommer", onClick: () => renameNoteClick() },
            { label: "Supprimer", onClick: () => deleteNoteClick() },
            { label: "Copier lien", onClick: () => getLinkOfNote() },
             { 
                    label: "📄 Exporter PDF", 
                    onClick: async () => {
                        try {
                            const blob = await exportNotePdf(note.idNote);
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${note.nameNote}.pdf`;
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                            window.URL.revokeObjectURL(url);
                        } catch (err) {
                            console.error("Erreur PDF", err);
                            alert("Impossible de générer le PDF !");
                        }
                        setMenuContextuel(null);
                    } 
                },
            ],
            onClose: () => setMenuContextuel(null)
        });

    };


  async function loadFileOnEditor(){
    note.contentNote = await remplacerLiensMarkdown(note.contentNote || "");
    spookyContext.setOpenedNote(note);
    spookyContext.setUpdateNoteParentFolder(updateParent || (() => {}));
  }

  const openFile = async () => {
    if (spookyContext.openedNote) {
      if (spookyContext.editNoteSaveFunction) {
        await spookyContext.editNoteSaveFunction();
        await new Promise(resolve => setTimeout(resolve, 300));
        if (updateParent) updateParent();
        loadFileOnEditor();
        console.log("Saved current note before opening new one.");
      }
    }else{
      loadFileOnEditor();
    }
  }

  function getLinkOfNote(){

    let link = "["+note.nameNote+"](" + window.location.origin + "/main/" + note.idNote + ")";
    navigator.clipboard.writeText(link)
    .then(() => {
      console.log("Texte copié !");
    })
    .catch(err => {
      console.error("Erreur lors de la copie :", err);
    });

  }

  return (
    <div className="OpenNoteComponent">
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