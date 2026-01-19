import type  { Note } from "../types/Note";

interface Props {
    note: Note;
}


export default function OpenNoteComponent({note}: Props) {
  return (
    <div className="OpenNoteComponent">
        <h3>🗒️ {note.nameNote}</h3>
    </div>
  )
}