import {useState} from 'react';
import {auth} from '../firebase/config.js' 
import { 
    createUserWithEmailAndPassword
  , signInWithEmailAndPassword
  , sendPasswordResetEmail
  , onAuthStateChanged
  , GoogleAuthProvider
  , signInWithPopup   } from "firebase/auth";

import {useDispatch} from 'react-redux';
import {setUser} from '../store/usersSlice.js';
  
const dict_errors = {
    "auth/weak-password": "A senha é muito fraca. Exija pelo menos 6 caracteres, incluindo números e letras.",
    "auth/invalid-email": "O endereço de e-mail é inválido.",
    "auth/user-not-found": "Não foi encontrada nenhuma conta com este e-mail ou número de telefone.",
    "auth/wrong-password": "A senha está incorreta.",
    "auth/email-already-in-use": "O endereço de e-mail já está sendo usado por outra conta.",
    "auth/operation-not-allowed": "Esta operação não é permitida para este projeto.",
    "auth/user-disabled": "Esta conta de usuário foi desativada.",
    "auth/too-many-requests": "Muitas tentativas de login. Tente novamente mais tarde.",
    "auth/invalid-api-key": "A chave da API fornecida é inválida.",
    "auth/requires-recent-login": "É necessário fazer login recentemente para realizar esta ação.",
    "auth/invalid-credential" : "E-mail ou senha Inválida"
    // Adicione mais erros aqui conforme necessário
}

function LoginPage() {

  const [loginType, setLoginType] = useState('login');

  const [userCredentials, setUserCredentials] = useState({})
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      dispatch(setUser({id: user.uid, email: user.email, photo: user.photoURL}));
    } else {
      dispatch(setUser(null));
    }
    
  });


  function handleCred(e){
    setUserCredentials({...userCredentials, [e.target.name]: e.target.value})
    console.log(userCredentials)
  } 
  
  function handleSignUp(e) {
    e.preventDefault();
    setError("");
    createUserWithEmailAndPassword(auth, userCredentials.email, userCredentials.password)
    .then((userCredential) => {

      console.log(userCredential.user)
      
      //dispatch(setUser({id: userCredential.user.uid, email: userCredential.user.email}));
    })
    .catch((error) => {
      console.log(error.code)
      console.log(error.message)
      
      setError( dict_errors[error.code] || error.message);
    });
  }

  function handleLogin(e){
    e.preventDefault();
    setError("");

    signInWithEmailAndPassword(auth, userCredentials.email, userCredentials.password)
    .then((userCredential) => {
      console.log(userCredential.user)
      // dispatch(setUser({id: userCredential.user.uid, email: userCredential.user.email}));
    })
    .catch((error) => {

      console.log(error.code)
      console.log(dict_errors[error.code])

      setError( dict_errors[error.code] || error.message);
    });
  } 

  function handlePasswordReset() {
    const email = prompt('Please enter your email');
    sendPasswordResetEmail(auth, email);
    alert('Email sent! Check your inbox for password reset instructions.');
  }

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider); 

      const user = result.user;  


      // Handle successful Google login here
      console.log('Google login successful:', user);
      // You can extract the user's email and other information from user
      // and pass it to your login function (potentially creating a user if needed)
      // handleLogin({ email: user.email }); // Example: Pass email to handleLogin
    } catch (error) {
      // Handle Google login errors
      console.error('Google login failed:', error);
      setError(error.message); // Or a more user-friendly error message
    }
  };



    return (
      <>
        <div className="container login-page">
          <section>
            <h1>Etec Albert Einstein</h1>
            <p>Entre ou crie uma conta para continuar.</p>
            <div className="login-type">
              <button 
                className={`btn ${loginType == 'login' ? 'selected' : ''}`}
                onClick={()=>setLoginType('login')}>
                  Entrar
              </button>
              <button 
                className={`btn ${loginType == 'signup' ? 'selected' : ''}`}
                onClick={()=>setLoginType('signup')}>
                  Criar Conta
              </button>
            </div>
            <form className="add-form login">
                  <div className="form-control">
                      <label>E-mail *</label>
                      <input onChange={(e)=>{handleCred(e)}} type="text" name="email" placeholder="Informe seu email" />
                  </div>
                  <div className="form-control">
                      <label>Senha *</label>
                      <input onChange={(e)=>{handleCred(e)}} type="password" name="password" placeholder="Informe a senha" />
                  </div>
                  {
                    loginType == 'login' ?
                    <button onClick={(e)=>handleLogin(e)} className="active btn btn-block">Entrar</button>
                    : 
                    <button onClick={(e)=>handleSignUp(e)} className="active btn btn-block">Criar Conta</button>


                  }

                  {
                    <button onClick={(e)=>handleGoogleLogin(e)} className="active btn btn-block">Login with Google</button>
                  }

 
                  {
                    error && 
                    <div className="error">
                      {error}
                    </div>
                  }
                  <p onClick={handlePasswordReset} className="forgot-password">Esqueci minha senha.</p>
                  
              </form>
          </section>
        </div>
      </>
    )
  }
  
  export default LoginPage
  