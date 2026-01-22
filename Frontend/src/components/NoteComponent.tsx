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
  
  // Current content (for backup)
  const [currentContent, setCurrentContent] = useState(note.contentNote || "");
  const [isEditing, setIsEditing] = useState(true);
  
  const [metadata, setMetadata] = useState({
    sizeBytes: 0, wordCount: 0, charCount: 0, lineCount: 0,
  });

  //update parent when note changes
  function updateNoteParent() {
    if (updateParent) {
      updateParent();
    }
  }

  

async function remplacerLiensMarkdown(texte : string) : Promise<string> {
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  let nouveauTexte = texte;

  // Table for storing promises
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
          })
        );
      }
    }
  }

  // Wait until all promises are completed
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
    updateLink();
    editorRef.current?.setMarkdown(note.contentNote || "");
    // Initial metadata calculation
    calculateMetadata(note.contentNote || "");
  }, [note]);

  // Heavy calculation function (moved outside of useEffect)
  const calculateMetadata = (content: string) => {
    const safeContent = content || "";
    const sizeBytes = new Blob([safeContent]).size;
    const words = safeContent.trim().split(/\s+/).filter(Boolean).length;
    const chars = safeContent.length;
    const lines = safeContent === "" ? 0 : safeContent.split("\n").length;
    
    setMetadata({ sizeBytes, wordCount: words, charCount: chars, lineCount: lines });
  };

  // Debounced update function
  const debouncedUpdate = useMemo(() => {
    return (newMarkdown: string) => {
      // Update the local state (quick)

      // Remove backslashes
      const cleanMarkdown = newMarkdown.replace(/\\/g, '');

      // Met à jour le state local
      setCurrentContent(cleanMarkdown);

      
      
      // We delay the heavy calculation (metadata)
      // To avoid installing lodash, we use a simple timeout here
      if (window.timerMetadata) clearTimeout(window.timerMetadata);
      window.timerMetadata = setTimeout(() => {
        calculateMetadata(newMarkdown);
      }, 500);
    };
  }, []);

    //connect the automatic context backup function
  useEffect(() => {
    spookyContext.setEditNoteSaveFunction(handleSave);
  }, [currentContent, title]);


    // automatic save function with every content change

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSave();
    }, 2000); // Saves every 2 seconds after the last change
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
    setNote(updatedNote); // Updates the local note
    updateNoteParent();
    console.log("Note saved:", updatedNote);
  };

  useEffect(() => {
    spookyContext.setEditNoteSaveFunction(handleSave);
    console.log(handleSave);
  },[]);

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
          markdown={currentContent} // Initial value
          readOnly={!isEditing}
          onChange={debouncedUpdate} // Using the debounced function
          contentEditableClassName="spooky-editor-content"
          plugins={[
            headingsPlugin(),
            listsPlugin(),
            quotePlugin(),
            thematicBreakPlugin(),
            markdownShortcutPlugin(),
            tablePlugin(),
            linkPlugin(),
            //links are forced to open normally in the same window (scroll wheel click available)
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
        <button onClick={() => getLinkOfNote()}>Copier lien vers note</button>
      
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

// A little hack to type the global timer without touching the declaration file
declare global {
  interface Window { timerMetadata: any; }
}

export default NoteComponent;
