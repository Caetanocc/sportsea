
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './views/LoginPage.jsx';
import MembrosPage from './views/MembrosPage.jsx'
import AddMembroPage from './views/AddMembroPage.jsx';
import AddTeamPage from './views/AddTeamPage.jsx';
import TeamsPage from './views/TeamsPage.jsx';
import EditTimePage from './views/EditTimePage.jsx';

import {selectUsers} from './store/usersSlice.js';
import {useSelector} from 'react-redux';

function App() {
  const user = useSelector(selectUsers);

  return (
    <>
      {
          user.currentUser ? 
          <BrowserRouter>
            <Routes>
              <Route index element={<TeamsPage />} />
              <Route path="/members" element={<MembrosPage />} />
              <Route path="/add-member" element={<AddMembroPage />} />
              <Route path="/teams" element={<TeamsPage />} />
              <Route path="/add-team" element={<AddTeamPage />} />
              <Route path="/time/:id" element={<EditTimePage />} />

            </Routes>
          </BrowserRouter>
          :
          <LoginPage />
      } 


    </>
  )
}

export default App


