import { createPortal } from 'react-dom';
import './MenuContextuelComponent.css'


interface Props {
    position : {x: number, y: number};
    actions: { label: string; onClick: () => void }[];
    onClose: () => void;
}

export type MenuContextuelProps = Props;

export default function MenuContextuelComponent({position, actions, onClose}:Props) {
    return createPortal(
    <div 
        className="MenuContextuelComponent" 
        style={{top: position.y, left: position.x }}  
        onMouseLeave={() => {onClose();}}
    >
        <ul>
        {actions.map((action, index) => (
            <li
            key={index}
            onClick={() => {
                action.onClick();
            }}
            >
            {action.label}
            </li>
        ))}
        </ul>
    </div>,
    document.body 
    );
}