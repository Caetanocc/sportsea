import Time from '../components/Team.jsx';
import Header from '../components/Header.jsx';
import { useSelector } from 'react-redux';
import { db } from '../firebase/config.js';
import { collection, query, where, getDocs } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { selectUsers } from '../store/usersSlice.js';

function TimesPage() {

    const uid = useSelector(selectUsers).currentUser.id;
    const [times, setTimes] = useState([]);

    const pageTitle = "⛹️‍♂️ Lista de Times";

    useEffect(() => {
        const fetchTimes = async () => {
            const q = query(collection(db, "times"), where("user_id", "==", uid));
            const querySnapshot = await getDocs(q);
            let timeList = [];
            querySnapshot.forEach((doc) => {
                timeList.push({ id: doc.id, ...doc.data() });
            });
            setTimes(timeList);
        };

        fetchTimes();
    }, [uid]);

    return (
        <>
            <div className="container">
                <Header pageTitle={pageTitle} />
                <div className="times-container">
                    <div className="times-list">
                        {times.map(time => 
                            <Time key={time.id} time={time} />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default TimesPage;
