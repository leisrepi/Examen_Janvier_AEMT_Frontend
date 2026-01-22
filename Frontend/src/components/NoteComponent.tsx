import React, { useState, useEffect, useRef, useMemo, useContext } from "react";
import { 
  MDXEditor, 
  headingsPlugin, 
  listsPlugin, 
  quotePlugin, 
  thematicBreakPlugin, 
  markdownShortcutPlugin,
  tablePlugin,
  linkPlugin,
  linkDialogPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  ListsToggle,
  CreateLink,
  InsertTable,
  type MDXEditorMethods,
  updateLink$
} from "@mdxeditor/editor";

import "@mdxeditor/editor/style.css";
import { SpookyContext, useSpooky } from "../contexts/SpookyContext";
import type { Note } from "../types/Note";
import "./Markdown.css"; 
import '../components/NoteComponent.css';
import { getNoteById } from "../service/SpookyService";

interface NoteComponentProps {
  noteData: Note;
  updateParent? : () => void;
}

const NoteComponent: React.FC<NoteComponentProps> = ({ noteData, updateParent }) => {
  const { updateExistingNote, removeNote } = useSpooky();
  const [title, setTitle] = useState(noteData.nameNote);
  const editorRef = useRef<MDXEditorMethods>(null);
  const [note, setNote] = useState<Note>(noteData);

  const spookyContext = useContext(SpookyContext);
  if (!spookyContext) return null; // Sécurité si le contexte est null
  
  // Contenu actuel (pour la sauvegarde)
  const [currentContent, setCurrentContent] = useState(note.contentNote || "");
  const [isEditing, setIsEditing] = useState(true);
  
  const [metadata, setMetadata] = useState({
    sizeBytes: 0, wordCount: 0, charCount: 0, lineCount: 0,
  });

  //mise a jour du parent quand la note change
  function updateNoteParent() {
    if (updateParent) {
      updateParent();
    }
  }

  

async function remplacerLiensMarkdown(texte : string) : Promise<string> {
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  let nouveauTexte = texte;

  // Tableau pour stocker les promesses
  const promesses = [];

  while ((match = regex.exec(texte)) !== null) {
    const texteLien = match[1];
    const url = match[2];
    let numero = null;

    if (url.startsWith("http://localhost:5173")) {
      const numMatch = url.match(/(\d+)$/);
      if (numMatch) {
        numero = parseInt(numMatch[1], 10);

        // Préparer la promesse pour remplacer le texte
        promesses.push(
          getNoteById(numero).then(note => {
            // Remplacer dans le texte original
            nouveauTexte = nouveauTexte.replace(
              `[${texteLien}](${url})`,
              `[${note.nameNote}](${url})`
            );
          })
        );
      }
    }
  }

  // Attendre que toutes les promesses soient terminées
  await Promise.all(promesses);

  return nouveauTexte;
}

  async function updateLink(){
    setCurrentContent(await remplacerLiensMarkdown(note.contentNote || ""));
  }

  useEffect(() => {
    updateNoteParent();
  }, [note]);

  // Initialisation
  useEffect(() => {
    setTitle(note.nameNote);
    //setCurrentContent(note.contentNote || "");
    updateLink();
    editorRef.current?.setMarkdown(note.contentNote || "");
    // Calcul initial des métadonnées
    calculateMetadata(note.contentNote || "");
  }, [note]);

  // Fonction lourde de calcul (déplacée hors du useEffect)
  const calculateMetadata = (content: string) => {
    const safeContent = content || "";
    const sizeBytes = new Blob([safeContent]).size;
    const words = safeContent.trim().split(/\s+/).filter(Boolean).length;
    const chars = safeContent.length;
    const lines = safeContent === "" ? 0 : safeContent.split("\n").length;
    
    setMetadata({ sizeBytes, wordCount: words, charCount: chars, lineCount: lines });
  };

  // VERSION OPTIMISÉE : On utilise useMemo pour créer une fonction "debouncée"
  // Elle ne s'exécutera que 500ms après la dernière frappe.
  const debouncedUpdate = useMemo(() => {
    return (newMarkdown: string) => {
      // On met à jour le state local (rapide)
      setCurrentContent(newMarkdown);
      
      // On retarde le calcul lourd (les métadonnées)
      // Pour éviter d'installer lodash, on utilise un simple timeout ici
      if (window.timerMetadata) clearTimeout(window.timerMetadata);
      window.timerMetadata = setTimeout(() => {
        calculateMetadata(newMarkdown);
      }, 500);
    };
  }, []);

  //connecter la fonction de sauvegarde automatique du contexte
  useEffect(() => {
    spookyContext.setEditNoteSaveFunction(handleSave);
  }, [currentContent, title]);


  // fonction de sauvegarde automatique à chaque changement de contenu
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSave();
    }, 2000); // Sauvegarde toutes les 2 secondes après le dernier changement
    return () => clearTimeout(timeoutId); 
  }, [currentContent, title]);

  const handleSave = async () => {
    const updatedNote: Note = {
      ...note,
      nameNote: title,
      contentNote: currentContent,
      lastModificationNote: new Date(),
    };
    await updateExistingNote(updatedNote);
    setNote(updatedNote); // Met à jour la note locale
    updateNoteParent();
    console.log("Note saved:", updatedNote);
  };

  useEffect(() => {
    spookyContext.setEditNoteSaveFunction(handleSave);
    console.log(handleSave);
  },[]);

  return (
    <div className="noteDiv">
      <h2 style={{ textAlign: "center", margin: "0px"}}>📓 {isEditing ? "Mode Écriture" : "Mode Lecture"}</h2>

      <input className="nameZone"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titre de la note"
        disabled={!isEditing}
        style={{ width: "100%", marginBottom: "10px", padding: "5px", fontSize: "1.2em" }}
      />

      <div className="markdown-body">
        <MDXEditor
          ref={editorRef}
          markdown={currentContent} // Valeur initiale
          readOnly={!isEditing}
          onChange={debouncedUpdate} // Utilisation de la fonction debouncée
          contentEditableClassName="spooky-editor-content"
          plugins={[
            headingsPlugin(),
            listsPlugin(),
            quotePlugin(),
            thematicBreakPlugin(),
            markdownShortcutPlugin(),
            tablePlugin(),
            linkPlugin(),
            //on force les liens a s'ouvrir normalement dans la meme fenetre (click molette disponible)
            linkDialogPlugin({
              onClickLinkCallback: (url) => window.location.assign(url),
              onReadOnlyClickLinkCallback: (event, _node, url) => {
                event.preventDefault();
                window.location.assign(url);
              }
            }),
            toolbarPlugin({
              toolbarContents: () => (
                <>
                  <UndoRedo />
                  <BlockTypeSelect />
                  <BoldItalicUnderlineToggles />
                  <ListsToggle />
                  <CreateLink />
                  <InsertTable />
                </>
              )
            })
          ]}
        />
      </div>

      <div style={{ marginTop: "10px", display: "flex", gap: "10px", justifyContent: "center" }}>
        <button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "👁️ Mode Lecture" : "✏️ Mode Écriture"}
        </button>
        {/* No need for save button --> auto save
            No need for delete button --> dedicated menu */}
        {/* {isEditing && <button onClick={handleSave}>💾 Enregistrer</button>} */}
        {/* <button onClick={() => removeNote(note.idNote)} style={{ backgroundColor: "#ff4d4d", color: "white" }}>
          🗑 Supprimer
        </button> */}
      </div>

      <div className="metadata" style={{ marginTop: "15px", fontSize: "14px", color: "#555", borderTop: "1px solid #eee", paddingTop: "10px" }}>
        <p><strong>Taille :</strong> {metadata.sizeBytes} octets</p>
        <p><strong>Mots :</strong> {metadata.wordCount}</p>
        <p><strong>Caractères :</strong> {metadata.charCount}</p>
        <p><strong>Lignes :</strong> {metadata.lineCount}</p>
        <p><strong>Créée le :</strong> {new Date(note.creationDateNote).toLocaleString()}</p>
        <p><strong>Dernière modification :</strong> {new Date(note.lastModificationNote).toLocaleString()}</p>
      </div>
    </div>
  );
};

// Petit hack pour typer le timer global sans toucher au fichier de déclaration
declare global {
  interface Window { timerMetadata: any; }
}

export default NoteComponent;
