import placeholder from '../../assets/placeholder_01.png';
import './BandeauComponent.css';

export default function BandeauComponent() {
    return <div className='bandeau'>
        <img src={placeholder} className="ghost" alt="ghostPicPlease" />

        <h1>Spooky Note</h1>
    </div>
}