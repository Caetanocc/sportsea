import { Link } from 'react-router-dom';

function Time({ time }) {
    return (
        <>
            <Link to={'/time/' + time.id}>
                <div className="time">
                    {
                        time.isPublic && 
                        <div className="public-status">
                            <i className="fa-solid fa-globe"></i>
                        </div>
                    }

                    <div className="time-escudo">
                        <img src={time.escudo} alt="Escudo do time" />

                        <button className={time.isPublic ? 'isPublic' : ''}>
                            <i className="fa-solid fa-globe"></i>
                            <span>{ time.isPublic ? "Público" : "Privado" }</span>
                        </button>
                    </div>

                    <div className="time-details">
                        <p className="time-esporte">{ time.esporte }</p>
                        <h3 className="time-nome">{ time.nome }</h3>
                    </div>
                </div>
            </Link>
        </>
    );
}

export default Time;
