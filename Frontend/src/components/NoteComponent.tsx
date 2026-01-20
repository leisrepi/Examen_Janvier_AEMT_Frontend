import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  MDXEditor, 
  headingsPlugin, 
  listsPlugin, 
  quotePlugin, 
  thematicBreakPlugin, 
  markdownShortcutPlugin,
  tablePlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  ListsToggle,
  CreateLink,
  InsertTable,
  type MDXEditorMethods
} from "@mdxeditor/editor";

import "@mdxeditor/editor/style.css";
import { useSpooky } from "../contexts/SpookyContext";
import type { Note } from "../types/Note";
import "./Markdown.css"; 

interface NoteComponentProps {
  note: Note;
}

const NoteComponent: React.FC<NoteComponentProps> = ({ note }) => {
  const { updateExistingNote, removeNote } = useSpooky();
  const [title, setTitle] = useState(note.nameNote);
  const editorRef = useRef<MDXEditorMethods>(null);
  
  // Contenu actuel (pour la sauvegarde)
  const [currentContent, setCurrentContent] = useState(note.contentNote || "");
  const [isEditing, setIsEditing] = useState(true);
  
  const [metadata, setMetadata] = useState({
    sizeBytes: 0, wordCount: 0, charCount: 0, lineCount: 0,
  });

  // Initialisation
  useEffect(() => {
    setTitle(note.nameNote);
    setCurrentContent(note.contentNote || "");
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

  const handleSave = async () => {
    const updatedNote: Note = {
      ...note,
      nameNote: title,
      contentNote: currentContent,
      lastModificationNote: new Date(),
    };
    await updateExistingNote(updatedNote);
    alert("Note sauvegardée ! 🎃");
    setIsEditing(false);
  };

  return (
    <div style={{ padding: "10px", border: "1px solid #ccc", backgroundColor: "#fff" }}>
      <h2>📓 {isEditing ? "Mode Écriture" : "Mode Lecture"}</h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titre de la note"
        disabled={!isEditing}
        style={{ width: "100%", marginBottom: "10px", padding: "5px", fontSize: "1.2em" }}
      />

      <div className="markdown-body" style={{ 
          backgroundColor: "#fff", 
          padding: "10px", 
          minHeight: "400px", 
          border: isEditing ? "2px solid #ba4400" : "none",
          borderRadius: "8px"
      }}>
        <MDXEditor
          ref={editorRef}
          markdown={currentContent} // Valeur initiale
          readOnly={!isEditing}
          onChange={debouncedUpdate} // ICI : On utilise la version optimisée
          contentEditableClassName="spooky-editor-content"
          plugins={[
            headingsPlugin(),
            listsPlugin(),
            quotePlugin(),
            thematicBreakPlugin(),
            markdownShortcutPlugin(),
            tablePlugin(),
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

      <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
        <button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "👁️ Mode Lecture" : "✏️ Mode Écriture"}
        </button>
        {isEditing && <button onClick={handleSave}>💾 Enregistrer</button>}
        <button onClick={() => removeNote(note.idNote)} style={{ backgroundColor: "#ff4d4d", color: "white" }}>
          🗑 Supprimer
        </button>
      </div>

      <div style={{ marginTop: "15px", fontSize: "14px", color: "#555", borderTop: "1px solid #eee", paddingTop: "10px" }}>
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