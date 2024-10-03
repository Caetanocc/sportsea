import Header from '../components/Header.jsx';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from "firebase/firestore"; 
import { db, auth } from '../firebase/config.js';

function AddTimePage() {

    const navigate = useNavigate();

    const handleAddTime = async (e) => {
        e.preventDefault();

        const newTime = {
            nome: document.querySelector('input[name=nome]').value,
            escudo: document.querySelector('input[name=escudo]').value,
            esporte: document.querySelector('input[name=esporte]').value,
            isPublic: document.querySelector('input[name=isPublic]').checked,
        }

        if (newTime.nome && newTime.escudo && newTime.esporte) {

            newTime.user_id = auth.currentUser.uid;
            const docRef = await addDoc(collection(db, "times"), newTime);
            newTime.id = docRef.id;

            alert('Time incluído com sucesso!');
            navigate("/");
        } else {
            alert('Por favor, preencha os campos obrigatórios.');
        }
    }

    const pageTitle = "Adicionar 1 Time";

    return (
        <>
            <div className="container">
                <Header pageTitle={pageTitle} />

                <form className="add-form">
                    <div className="form-control">
                        <label>Nome do Time *</label>
                        <input type="text" name="nome" placeholder="Nome do time" />
                    </div>
                    <div className="form-control">
                        <label>Escudo do Time *</label>
                        <input type="text" name="escudo" placeholder="Escudo: informe uma URL do escudo" />
                    </div>
                    <div className="form-control">
                        <label>Esporte *</label>
                        <input type="text" name="esporte" placeholder="Esporte praticado" />
                    </div>
                    <div className="form-control">
                        <label>Time Público?</label>
                        <input type="checkbox" name="isPublic" /> Público
                    </div>

                    <button onClick={(e) => handleAddTime(e)} className="btn btn-block">Salvar</button>
                </form>
            </div>
        </>
    );
}

export default AddTimePage;
