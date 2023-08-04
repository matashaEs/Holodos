import React, { useEffect, useState, setState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./login.scss";
import imga from '../../assets/img/background.jfif';
import logo2 from '../../assets/img/logo2.svg';
import Header from '../Header';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessageEmail, setErrorMessageEmail] = useState('');
  const [errorMessagePassword, setErrorMessagePassword] = useState('');
  const [inputClassNameEmail, setInputClassNameEmail] = useState('');
  const [inputClassNamePassword, setInputClassNamePassword] = useState('');
  const [user, loading, err] = useAuthState(auth);
  const navigate = useNavigate();

  const logIn = async (e) => {
    e.preventDefault();
    setErrorMessageEmail('');
    setErrorMessagePassword('');
    setInputClassNameEmail('');
    setInputClassNamePassword('');

    let response = await logInWithEmailAndPassword(email, password);

    const fields = [email, password];
    const setInputClassName = [setInputClassNameEmail, setInputClassNamePassword];
    const setErrorMessage = [setErrorMessageEmail, setErrorMessagePassword];

    for (let i = 0; i < fields.length; i++) {
      if (fields[i].length === 0) {
        setErrorMessage[i]('Field is required');
        setInputClassName[i]('login__input--red');
      }
    }

    if (fields[0].length != 0) {
      if (response.hasOwnProperty("message")) {
        switch (response.code) {
          case 'auth/invalid-email':
          case 'auth/user-not-found':
            setErrorMessageEmail('Invalid email');
            setInputClassNameEmail('login__input--red');
            break;
          case 'auth/wrong-password':
            setErrorMessagePassword('Invalid password');
            setInputClassNamePassword('login__input--red');
            break;
          case 'auth/too-many-requests':
            setErrorMessagePassword('Too many attempts. Try again later');
            setInputClassNamePassword('login__input--red');
            break;
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
          <div className="login__title-form">
            <div className="h1 login__title">Welcome to Holodos</div>
            <div className="login__form">
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
              <Link to="/reset">
                <button className="button--green p login__button--green">
                  Forgot password?
                </button>
              </Link>
              <button
                className="button login__button h3"
                onClick={logIn}
              >
                Log in
              </button>
            </div>
          </div>
          <div className="login__new">
            <div className="login__new-account p">New Holodos?&nbsp;</div>
            <Link to="/registration">
              <button className="button--green p button-arrow">Сreate Account</button>
            </Link>
          </div>
        </div>
        <div className="login__right" style={{ backgroundImage: `url(${imga})` }}>

        </div>
      </div>
    </div>
  );
}
export default Login;