import Header from '../components/Header.jsx';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from '../firebase/config.js';

function AddMembroPage() {

    const navigate = useNavigate();

    const handleAddMembro = async (e) => {
        e.preventDefault();

        const newMembro = {
            nome: document.querySelector('input[name=nome]').value,
            foto: document.querySelector('input[name=foto]').value,
            fone: document.querySelector('input[name=fone]').value,
            nascimento: document.querySelector('input[name=nascimento]').value,
        }

        if (newMembro.nome && newMembro.foto && newMembro.fone && newMembro.nascimento) {
            newMembro.user_id = auth.currentUser.uid;
            const docRef = await addDoc(collection(db, "membros"), newMembro);
            newMembro.id = docRef.id;

            alert('Membro incluído com sucesso!');
            navigate("/");
        } else {
            alert('Por favor, preencha os campos obrigatórios.');
        }
    }

    const pageTitle = "Adicionar Membro";

    return (
        <>
            <div className="container">
                <Header pageTitle={pageTitle} />

                <form className="add-form">
                    <div className="form-control">
                        <label>Nome *</label>
                        <input type="text" name="nome" placeholder="Nome do membro" />
                    </div>
                    <div className="form-control">
                        <label>Foto *</label>
                        <input type="text" name="foto" placeholder="Foto: informe uma URL da foto" />
                    </div>
                    <div className="form-control">
                        <label>Fone *</label>
                        <input type="text" name="fone" placeholder="Fone de contato" />
                    </div>
                    <div className="form-control">
                        <label>Data de Nascimento *</label>
                        <input type="date" name="nascimento" />
                    </div>

                    <button onClick={(e) => handleAddMembro(e)} className="btn btn-block">Salvar</button>
                </form>
            </div>
        </>
    );
}

export default AddMembroPage;
