import Header from '../components/Header.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, updateDoc, getDoc, collection, query, getDocs, writeBatch, where } from "firebase/firestore";
import { db } from '../firebase/config.js';
import { useEffect, useState } from 'react';
import Modal from 'react-modal'; // Pacote para modal

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        maxHeight: '80vh',
        overflow: 'auto'
    },
};

function EditTimePage() {
    const { id } = useParams(); // Pega o ID do time da URL
    const navigate = useNavigate();

    const [time, setTime] = useState({});
    const [membros, setMembros] = useState([]);
    const [selectedMembros, setSelectedMembros] = useState([]); // Membros selecionados para inclusão
    const [membrosInfo, setMembrosInfo] = useState([]); // Para armazenar os dados dos membros já incluídos no time
    const [markedMembros, setMarkedMembros] = useState([]); // Para armazenar temporariamente os membros marcados no modal
    const [modalIsOpen, setModalIsOpen] = useState(false); // Estado do modal

    const pageTitle = "Editar Time";

    useEffect(() => {
        // Função para buscar dados do time
        const fetchTime = async () => {
            const docRef = doc(db, "times", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setTime(docSnap.data());
                setSelectedMembros(docSnap.data().membros || []); // Membros associados ao time
            } else {
                alert("Time não encontrado!");
                navigate("/");
            }
        };

        // Função para buscar membros
        const fetchMembros = async () => {
            const q = query(collection(db, "membros"));
            const querySnapshot = await getDocs(q);
            let membroList = [];
            querySnapshot.forEach((doc) => {
                membroList.push({ id: doc.id, ...doc.data() });
            });
            setMembros(membroList);
        };

        // Função para buscar informações detalhadas dos membros já incluídos no time
        const fetchSelectedMembrosInfo = async () => {
            const q = query(collection(db, "membros") , where("time_id", "==", id) );

            const querySnapshot = await getDocs(q);
            let membrosDetails = [];
            querySnapshot.forEach((doc) => {
                if (selectedMembros.includes(doc.id)) {
                    membrosDetails.push({ id: doc.id, ...doc.data() });
                }
            });
            console.log(membrosDetails)
            
            setMembrosInfo(membrosDetails);
        };

        fetchTime();
        fetchMembros();
        fetchSelectedMembrosInfo();

    }, [])  //[id, navigate, selectedMembros]);

    const handleUpdateTime = async (e) => {
        e.preventDefault();

        const updatedTime = {
            nome: document.querySelector('input[name=nome]').value,
            escudo: document.querySelector('input[name=escudo]').value,
            esporte: document.querySelector('input[name=esporte]').value,
            isPublic: document.querySelector('input[name=isPublic]').checked,
            membros: selectedMembros, // Atualiza com os membros selecionados
        };

        if (updatedTime.nome && updatedTime.escudo && updatedTime.esporte) {
            const docRef = doc(db, "times", id);
            await updateDoc(docRef, updatedTime);

            alert('Time atualizado com sucesso!');
            navigate("/");
        } else {
            alert('Por favor, preencha os campos obrigatórios.');
        }
    };

    // Função para abrir o modal
    const openModal = () => {
        setMarkedMembros(selectedMembros); // Define os membros já selecionados ao abrir o modal
        setModalIsOpen(true);
    };

    // Função para fechar o modal
    const closeModal = () => {
        setModalIsOpen(false);
    };

    // Função para marcar ou desmarcar membros no modal
    const handleCheckboxChange = (membroId) => {
        setMarkedMembros((prevMarked) =>
            prevMarked.includes(membroId)
                ? prevMarked.filter((id) => id !== membroId) // Remove se já estiver marcado
                : [...prevMarked, membroId] // Adiciona se não estiver marcado
        );
    };

    // Função para incluir os membros no time (atualiza o time_id no documento de cada membro)
    const incluirMembrosNoTime = async () => {
        const batch = writeBatch(db);

        markedMembros.forEach((membroId) => {
            const membroRef = doc(db, "membros", membroId);
            batch.update(membroRef, { time_id: id });
        });

        try {
            await batch.commit();
            setSelectedMembros(markedMembros); // Atualiza o estado de membros no time
            alert('Membros incluídos no time com sucesso!');
            closeModal(); // Fecha o modal após salvar
        } catch (error) {
            console.error('Erro ao incluir membros no time: ', error);
            alert('Ocorreu um erro ao incluir os membros. Tente novamente.');
        }
    };

    return (
        <>
            <div className="container">
                <Header pageTitle={pageTitle} />

                <form className="edit-form">
                    <div className="form-control">
                        <label>Nome do Time *</label>
                        <input type="text" name="nome" defaultValue={time.nome} placeholder="Nome do time" />
                    </div>

                    {time.escudo && (
                        <div className="form-control">
                            <img
                                src={time.escudo}
                                alt="Escudo do Time"
                                style={{ width: '100px', height: '100px', marginBottom: '10px' }}
                            />
                        </div>
                    )}

                    <div className="form-control">
                        <label>Escudo do Time *</label>
                        <input type="text" name="escudo" defaultValue={time.escudo} placeholder="Escudo: informe uma URL do escudo" />
                    </div>

                    <div className="form-control">
                        <label>Esporte *</label>
                        <input type="text" name="esporte" defaultValue={time.esporte} placeholder="Esporte praticado" />
                    </div>
                    <div className="form-control">
                        <label>Time Público?</label>
                        <input type="checkbox" name="isPublic" defaultChecked={time.isPublic} /> Público
                    </div>

                    <div className="form-control">
                        <label>Membros do Time</label>
                        <div className="membros-list">
                            {/* Exibe a foto e o nome dos membros */}
                            {membrosInfo.map((membro) => (
                                <div key={membro.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                    <img src={membro.foto} alt={membro.nome} style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }} />
                                    <p>{membro.nome}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Botão para abrir o modal de inclusão de membro */}
                    <button type="button" onClick={openModal} className="btn">Incluir Membro</button>

                    <button onClick={(e) => handleUpdateTime(e)} className="btn btn-block">Salvar</button>
                </form>
            </div>

            {/* Modal para exibir membros */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Seleção de Membros"
            >
                <h2>Selecionar Membros</h2>
                <div className="membros-list">
                    {membros.map((membro) => (
                        <div key={membro.id}>
                            <input
                                type="checkbox"
                                checked={markedMembros.includes(membro.id)}
                                onChange={() => handleCheckboxChange(membro.id)} // Marcar ou desmarcar membro
                            />
                            <label>{membro.nome} - {membro.fone}</label>
                        </div>
                    ))}
                </div>
                {/* Botão para incluir os membros no time */}
                <button onClick={incluirMembrosNoTime} className="btn ">Incluir no time</button>
                <button onClick={closeModal} className="btn ">Fechar</button>
            </Modal>
        </>
    );
}

export default EditTimePage;
