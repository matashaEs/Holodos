import { async } from "@firebase/util";
import { useRef, useState } from "react";

import { signup, logout, login, useAuth } from "../../firebase";

function Login() {
  const [ loading, setLoading ] = useState(false);
  const currentUser = useAuth();

const emailRef = useRef();
const passwordRef = useRef();

async function handleLogin() {
  setLoading(true);
  try {
    await login(emailRef.current.value, passwordRef.current.value);
  } catch {
    alert("error");
  }
  setLoading(false);
}
async function handleLogout() {
  setLoading(true);
  try {
    await logout();
  } catch {
    alert('error');
  }
  setLoading(false);
}
  async function handleSignUp() {

    setLoading(true);
    try {
      await signup(emailRef.current.value, passwordRef.current.value);
    } catch {
      alert("error");
    }
    setLoading(false);
  }

  return (
    <div className="login">

      <div>Current: { currentUser?.email }</div>
  
        <input ref={emailRef} placeholder="Email" />
        <input ref={passwordRef} type="password" placeholder="Password" />
      
      <button disabled={loading || currentUser } onClick={handleSignUp} >Sign up</button>
      <button disabled={loading || currentUser } onClick={handleLogin} >Log in</button>
      <button disabled={loading || !currentUser } onClick={handleLogout} >Log Out</button>
    </div>
  );
}

export default Login;
