import { NavLink } from "react-router-dom";
import { signOut } from "firebase/auth";
import {auth} from '../firebase/config.js';
import {useDispatch} from 'react-redux';
import {setUser} from '../store/usersSlice.js';

// eslint-disable-next-line react/prop-types
function Header({pageTitle }) {
  
  const dispatch = useDispatch();
  
  function handleSignOut(){
    if(confirm('Deseja sair , tem certeza?')) {
      signOut(auth).then(() => {
        dispatch(setUser(null));
      }).catch((error) => {
        console.log(error);
      });

    }
  }

    return (
      <>

            <h1>{pageTitle}</h1>

            <div className="header-btns">

                    <NavLink to="/">
                      <button className="btn"> Times </button>
                    </NavLink>

                    <NavLink to="/add-team">
                      <button className="btn"> Add Time +</button>
                    </NavLink>

                    <NavLink to="/members">
                      <button className="btn">
                          Membros
                      </button>
                    </NavLink>

                    <NavLink to="/add-member">
                      <button className="btn">
                          Add Membro +
                      </button>
                    </NavLink>

                    <button onClick={handleSignOut} className="btn transparent">
                      Sair
                    </button>

               
            </div>
    
      </>
    )
  }
  
  export default Header
  