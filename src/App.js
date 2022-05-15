
import './App.css';
import app from './firebase.init';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { useState } from 'react';
const auth = getAuth(app);

function App() {
  const [validated, setValidated] = useState(false);
  const[email,setEmail]=useState('');
  const[password,setPassword]=useState('');
  const[error,setError]=useState('');
  const[success,setSuccess]=useState('');
  const[resistered,setRestired]=useState(false);
  // resistration successful message
  const resistrationSuccess=()=>{
    const message=alert('successfuly resistered');
    setSuccess(message)
  }
  // email handel
  const handelEmailBlur=event=>{
    setEmail(event.target.value)
  }
  // password hamdel
  const handelPasswordBlur=event=>{
    setPassword(event.target.value)
  }
  // handel check resister
  const handelResistered=event=>{
    setRestired(event.target.checked)
  }
  // submit the form
  const handelSumitForm=event=>{
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
       return;
    }
  //  test password 
    if(!/(?=.*[0-9])/.test(password)){
      setError('please type at least one number');
      return;
    }
    setError('')
  if(resistered){
    
    signInWithEmailAndPassword(auth, email, password)
    .then(result=>{
      const user=result.user;
      console.log(user);
      setEmail('');
      setPassword('');
    })
    .catch(error=>{
      setError(error.message)
    })
  }
  else{
    createUserWithEmailAndPassword(auth, email, password)
    .then(result=>{
      const user=result.user;
      console.log(user);
      setEmail('');
      setPassword('');
      emailVerification();
      resistrationSuccess();
    })
    .catch(error=>{
       setError(error.message)
    })
  }
  setValidated(true);
  event.preventDefault();

  }
  // verification by email
  const emailVerification=()=>{
    sendEmailVerification(auth.currentUser)
    .then(()=>{
      console.log('email sent')
    })
  }
  // reset password
const resetPassword=()=>{
  sendPasswordResetEmail(auth, email)
  .then(()=>{
    console.log("reset password email send")
  })
  

}
  return (
    <div >
      <div className='w-50 mx-auto mt-5 bg-success'>
        <h1 className='text-white text-center pt-2'>{resistered?"LogIn Here":"Resister Now"}</h1>
        <Form noValidate validated={validated} className='p-4' onSubmit={handelSumitForm}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label className='text-white fs-4'>Email address</Form.Label>
            <Form.Control onBlur={handelEmailBlur} type="email" placeholder="Enter email" />
           
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label className='text-white fs-4'>Password</Form.Label>
            <Form.Control  onBlur={handelPasswordBlur} type="password" placeholder="Password" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check className='text-white fs-4' onChange={handelResistered} type="checkbox" label="already resister" />
          </Form.Group>
          <p>{error}</p>
          <p className='text-white fs-3'>{success}</p>
          <button onClick={resetPassword} className='bg-success border-0 pb-2 text-white'>Forget Password?</button>
          <br></br>
          <Button  variant="primary" type="submit">
            {resistered?"LogIn":"Resister"}
          </Button>
        </Form>
      </div>

    </div>
  );
}

export default App;
