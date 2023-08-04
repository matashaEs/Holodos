import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  registerWithEmailAndPassword
} from "../../firebase";
import './../login/login.scss';
import './registration.scss';
import imga from '../../assets/img/background.jfif';
import logo2 from '../../assets/img/logo2.svg';
import Header from '../Header';

function Registration() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [user] = useAuthState(auth);
  const [errorMessageName, setErrorMessageName] = useState('');
  const [errorMessageEmail, setErrorMessageEmail] = useState('');
  const [errorMessagePassword, setErrorMessagePassword] = useState('');
  const [inputClassNameName, setInputClassNameName] = useState('');
  const [inputClassNameEmail, setInputClassNameEmail] = useState('');
  const [inputClassNamePassword, setInputClassNamePassword] = useState('');
  const navigate = useNavigate();

  const register = async (e) => {
    e.preventDefault();
    setErrorMessageName('');
    setErrorMessageEmail('');
    setErrorMessagePassword('');
    setInputClassNameName('');
    setInputClassNameEmail('');
    setInputClassNamePassword('')

    let response = await registerWithEmailAndPassword(name, email, password);

    const fields = [email, password];
    const setInputClassName = [setInputClassNameEmail, setInputClassNamePassword];
    const setErrorMessage = [setErrorMessageEmail, setErrorMessagePassword];

    for (let i = 0; i < fields.length; i++) {
      if (fields[i].length === 0) {
        setErrorMessage[i]('Field is required');
        setInputClassName[i]('login__input--red');
      }
    }
    console.log("dsd");
    if (fields[0].length !== 0) {
      if (response.hasOwnProperty("message")) {

        switch (response.code) {
          case 'auth/invalid-email':
          case 'auth/internal-error':
            setErrorMessageEmail('Invalid email');
            setInputClassNameEmail('login__input--red');
            break;
          case 'auth/weak-password':
            setErrorMessagePassword('Week password');
            setInputClassNamePassword('login__input--red');
            break;
          case 'auth/too-many-requests':
            setErrorMessagePassword('Too many attempts. Try again later');
            setInputClassNamePassword('login__input--red');
            break;
          case 'auth/email-already-in-use':
            setErrorMessageEmail('Email already in use');
            setInputClassNameEmail('login__input--red');
            break;
          default:
            setErrorMessagePassword('Please, contact us');
            setInputClassNamePassword('login__input--red');
        }
      }
    }
  };
  useEffect(() => {
    if (user) navigate("/home");
  }, [user]);
  return (
    <div className="login container-fluid">
      <div className="container">
        <div className="login__left">
        <Link to="/home">
            <div className="login__logo"><img src={logo2}></img></div>
          </Link>
          <div className="login__title-form registration__form">
            <div className="h1 login__title">Registration</div>
            <div className="login__form">
              <input
                type="text"
                className={`${inputClassNameName} login__input h3`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
              />
              <div className="p login__error">{errorMessageName}</div>
              <input
                type="text"
                className={`${inputClassNameEmail} login__input h3`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
              <div className="p login__error">{errorMessageEmail}</div>
              <input
                type="password"
                className={`${inputClassNamePassword} login__input h3`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              <div className="p login__error">{errorMessagePassword}</div>
              <button className="button login__button h3" onClick={register}>
                Register
              </button>
            </div>
          </div>
          <div className="login__new">
            <div >Already have an account?&nbsp;</div>
            <Link to="/login">
              <button className="button--green p  button-arrow">Log in</button>
            </Link>
          </div>
        </div>
        <div className="login__right" style={{ backgroundImage: `url(${imga})` }}>

        </div>
      </div>
    </div>
  );
}
export default Registration;