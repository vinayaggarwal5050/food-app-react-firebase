import { useRef, useState } from "react";
import { auth, googleProvider} from "../config/firebase-config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";


const SigninPage = () => {

  const emailRef = useRef();
  const passwordRef = useRef();
  const [userEmail, setUserEmail] = useState("guest");

  console.log(auth?.currentUser?.email);

  const signUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value);
      console.log("new user created: ", auth.currentUser.email);
      setUserEmail(auth.currentUser.email);

    } catch(err) {
      console.log(err);
    }

  };

  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value);
      console.log("sign in successfull for: ", auth.currentUser.email);
      setUserEmail(auth.currentUser.email);

    } catch(err) {
      console.error(err);
    }
  }

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      console.log("sign in successfull for: ", auth.currentUser.email);
      setUserEmail(auth.currentUser.email);

    } catch(err) {
      console.error(err);
    }
  }

  const doSignOut = async () => {
    try {
      console.log(`current user: ${auth?.currentUser?.email} clicked sign out button`);
      await signOut(auth);
      console.log('you have been signed out');
      console.log(auth?.currentUser?.email);
      setUserEmail("Guest");

    } catch(err) {
      console.error(err);
    }
  }

  return(
    <>
      <input type="text" ref={emailRef} placeholder="Email..." />
      <input type="text" ref={passwordRef} placeholder="Password..." />
      <button onClick={signIn}>SignIn</button>
      <button onClick={signUp}>Sign Up</button>
      <button onClick={signInWithGoogle}>Sign In With Google</button>
      <h5>Hello, {userEmail}</h5>
      <button onClick={doSignOut}>Sign Out</button>

    </>
  )
}

export default SigninPage;