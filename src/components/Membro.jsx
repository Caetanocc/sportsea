import { Link } from 'react-router-dom';

function Membro({ membro }) {
    return (
        <>
            <Link to={'/membro/' + membro.id}>
                <div className="membro">
                    <div className="membro-foto">
                        <img src={membro.foto} alt="Foto do membro" />
                    </div>

                    <div className="membro-details">
                        <h3 className="membro-nome">{membro.nome}</h3>
                        <p className="membro-fone">Fone: {membro.fone}</p>
                        <p className="membro-nascimento">Data de Nascimento: {new Date(membro.nascimento).toLocaleDateString()}</p>
                    </div>
                </div>
            </Link>
        </>
    );
}

export default Membro;
