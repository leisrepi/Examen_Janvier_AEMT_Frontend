import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useSpooky } from '../contexts/SpookyContext';
import type { Note } from '../types/Note';
import './Markdown.css'; // CSS pour le style Halloween

interface NoteComponentProps {
  note: Note;
}

const NoteComponent: React.FC<NoteComponentProps> = ({ note }) => {
  const { updateExistingNote, removeNote } = useSpooky();
  const [title, setTitle] = useState(note.nameNote);
  const [content, setContent] = useState(note.contentNote || '');
  const [isEditing, setIsEditing] = useState(true);
  const [metadata, setMetadata] = useState({
    sizeBytes: 0,
    wordCount: 0,
    charCount: 0,
    lineCount: 0,
  });

  // Calcul des métadonnées en temps réel
  useEffect(() => {
    const safeContent = content || '';
    const sizeBytes = new Blob([safeContent]).size;
    const words = safeContent.trim().split(/\s+/).filter(Boolean).length;
    const chars = safeContent.length;
    const lines = safeContent.split('\n').length;
    setMetadata({ sizeBytes, wordCount: words, charCount: chars, lineCount: lines });
  }, [content]);

  const handleSave = async () => {
    const updatedNote: Note = {
      ...note,
      nameNote: title,
      contentNote: content,
      lastModificationNote: new Date(),
    };
    await updateExistingNote(updatedNote);
    alert('Note sauvegardée avec succès !');
    setIsEditing(false);
  };

  return (
    <div style={{ padding: '10px', border: '1px solid #ccc' }}>
      <h2>📓 {isEditing ? 'Mode Écriture' : 'Mode Lecture'}</h2>

      {/* Titre */}
      {isEditing ? (
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: '100%', marginBottom: '10px' }}
        />
      ) : (
        <h3>{title}</h3>
      )}

      {/* Contenu */}
      {isEditing ? (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={15}
          style={{ width: '100%' }}
          placeholder="Écrivez en Markdown..."
        />
      ) : (
        <div className="markdown-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>
      )}

      {/* Boutons */}
      <div style={{ marginTop: '10px' }}>
        <button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Mode Lecture' : 'Mode Écriture'}
        </button>
        {isEditing && <button onClick={handleSave}>💾 Enregistrer</button>}
        <button onClick={() => removeNote(note.idNote)}>🗑 Supprimer</button>
      </div>

      {/* Métadonnées */}
      <div style={{ marginTop: '15px', fontSize: '14px', color: '#555' }}>
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

export default NoteComponent;
