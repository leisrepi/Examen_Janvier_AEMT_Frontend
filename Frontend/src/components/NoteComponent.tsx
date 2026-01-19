
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { type Note } from '../types/Note';
import { updateNote } from '../service/SpookyService'; // Ton service fusionné ou séparé

interface NoteComponentProps {
  note: Note; // La note à afficher/modifier
}

const NoteComponent: React.FC<NoteComponentProps> = ({ note }) => {
  const [title, setTitle] = useState(note.nameNote);
  const [content, setContent] = useState(note.contentNote);
  const [isEditing, setIsEditing] = useState(true);
  const [metadata, setMetadata] = useState({
    sizeBytes: 0,
    wordCount: 0,
    charCount: 0,
    lineCount: 0,
  });

  // Calcul des métadonnées en temps réel
  useEffect(() => {
    const sizeBytes = new Blob([content]).size;
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    const chars = content.length;
    const lines = content.split('\n').length;

    setMetadata({
      sizeBytes,
      wordCount: words,
      charCount: chars,
      lineCount: lines,
    });
  }, [content]);

  const handleSave = async () => {
    try {
      const updatedNote: Note = {
        ...note,
        nameNote: title,
        contentNote: content,
        lastModificationNote: new Date(),
      };
      await updateNote(updatedNote); // Appel API pour sauvegarder
      alert('Note sauvegardée avec succès !');
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde :', error);
      alert('Impossible de sauvegarder la note.');
    }
  };

  return (
    <div className='OpenedNote' style={{ display: 'flex', gap: '20px' }}>
      <div style={{ flex: 1 }}>
        <h2>
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          ) : (
            title
          )}
        </h2>

        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={15}
            cols={50}
            style={{ width: '100%' }}
          />
        ) : (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        )}

        <div style={{ marginTop: '10px' }}>
          <button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Mode Lecture' : 'Mode Écriture'}
          </button>
          {isEditing && (
            <button onClick={handleSave} style={{ marginLeft: '10px' }}>
              Enregistrer
            </button>
          )}
        </div>

        <div style={{ marginTop: '10px', fontSize: '0.9em', color: '#666' }}>
          <p><strong>Métadonnées :</strong></p>
          <p>Taille : {metadata.sizeBytes} octets</p>
          <p>Mots : {metadata.wordCount}</p>
          <p>Caractères : {metadata.charCount}</p>
          <p>Lignes : {metadata.lineCount}</p>
          <p>Créée le : {new Date(note.creationDateNote).toLocaleString()}</p>
          <p>Dernière modif : {new Date(note.lastModificationNote).toLocaleString()}</p>
        </div>
      </div>

      {/* Live Preview Markdown */}
      {isEditing && (
        <div style={{ flex: 1, borderLeft: '1px solid #ccc', paddingLeft: '20px' }}>
          <h3>Prévisualisation Markdown</h3>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default NoteComponent;
