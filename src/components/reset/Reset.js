import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { auth, sendPasswordReset } from "../../firebase";
import './../login/login.scss';
import "./reset.scss";
import imga from '../../assets/img/background.jfif';
import logo2 from '../../assets/img/logo2.svg';
import Header from '../Header';

function Reset() {
  const [email, setEmail] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const [errorMessageEmail, setErrorMessageEmail] = useState('');
  const [inputClassNameEmail, setInputClassNameEmail] = useState('');
  const navigate = useNavigate();

  const reset = async (e) => {
    e.preventDefault();
    setErrorMessageEmail('');
    setInputClassNameEmail('');

    let response = await sendPasswordReset(email);

    if (response.hasOwnProperty("message")) {
      switch (response.code) {
        case 'auth/invalid-email':
          setErrorMessageEmail('Invalid email');
          setInputClassNameEmail('login__input--red');
          break;
        case 'auth/missing-email':
          setErrorMessageEmail('Email is requied');
          setInputClassNameEmail('login__input--red');
          break;
        case 'user-not-found':
          setErrorMessageEmail('User not found');
          setInputClassNameEmail('login__input--red');
          break;
      }
    }

    console.log(response.code);
  }

  useEffect(() => {
    if (user) navigate("/home");
  }, [user]);

  return (
    <div className="reset login container-fluid">
      <div className="container">
        <div className="login__left">
          <Link to="/home">
            <div className="login__logo"><img src={logo2}></img></div>
          </Link>
          <div className="login__title-form registration__form">
            <div className="h1 login__title">Recover your password</div>
            <div className="login__form">
              <input
                type="text"
                className={`${inputClassNameEmail} login__input h3`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
              <div className="p login__error">{errorMessageEmail}</div>
              <button
                className="button login__button h3"
                onClick={reset}
              >
                Recover
              </button>
            </div>
          </div>
          <div className="login__new">
            <div className="login__new-account p">Ready?&nbsp;</div>
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
export default Reset;