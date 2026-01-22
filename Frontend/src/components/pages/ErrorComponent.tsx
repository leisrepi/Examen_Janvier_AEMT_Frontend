import "./ErrorComponent.css";
import { useNavigate } from 'react-router-dom';

export default function ErrorComponenterr() {
      const navigate = useNavigate();
    return (
        <div className="error-page">
            <div className="overlay"></div>
            <h2 className="error-title">Quelque chose d'effrayant s'est passé</h2>
            <button onClick={() => navigate('/main')}>Retourner en lieu sûr</button>

            {/* Link to the home page */}
            {/* <Link to="/" className="home-link">Return to Safety</Link> */}

        </div>
    );
}
