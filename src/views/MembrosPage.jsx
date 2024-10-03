import Membro from '../components/Membro.jsx';
import Header from '../components/Header.jsx';
import { useSelector } from 'react-redux';
import { db } from '../firebase/config.js';
import { collection, query, where, getDocs } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { selectUsers } from '../store/usersSlice.js';

function MembrosPage() {

    const uid = useSelector(selectUsers).currentUser.id;
    const [membros, setMembros] = useState([]);

    const pageTitle = "👥 Lista de Membros";

    useEffect(() => {
        const fetchMembros = async () => {
            const q = query(collection(db, "membros"), where("user_id", "==", uid));
            const querySnapshot = await getDocs(q);
            let membroList = [];
            querySnapshot.forEach((doc) => {
                membroList.push({ id: doc.id, ...doc.data() });
            });
            setMembros(membroList);
        };

        fetchMembros();
    }, [uid]);

    return (
        <>
            <div className="container">
                <Header pageTitle={pageTitle} />
                <div className="membros-container">
                    <div className="membros-list">
                        {membros.map(membro => 
                            <Membro key={membro.id} membro={membro} />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default MembrosPage;
