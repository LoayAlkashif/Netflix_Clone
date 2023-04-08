import { useState } from 'react'
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import './SignupScreen.css';
import { useNavigate } from 'react-router-dom';

function SignInScreen() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  const register = (e) => {
    e.preventDefault();

    createUserWithEmailAndPassword(  auth, email, password
      
    ).then((authUser) => {
      if(auth) {
        navigate('/');
      }
        
    }).catch ((error) => {
      alert(error.message);
    });
  };

  const signIn = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(  auth, email, password
    ).then((authUser) => {
        
    }).catch ((error) => {
      alert(error.message);
    });
  };

  return (
    <div className='signupScreen'>
      <form >
        <h1>Sign In</h1>
        <input value={email} type="email" placeholder='Email' onChange={e => setEmail(e.target.value)}/>
        <input value={password} type="password" placeholder='Password' onChange={e => setPassword(e.target.value)} />
        <button type='submit' onClick={signIn}>Sign In</button>
        
        <h4> 
          <span className='signup__gray'>New to Netflix?</span> 
          <span className='signup__link' onClick={register}> Sign Up now.</span></h4>
      </form>
      

    </div>
  )
}

export default SignInScreen;



