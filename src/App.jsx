import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Users from "./components/Users";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        console.log("User Exists:::", user);
        setLoggedInUser(user);

        // ...
      } else {
        console.log("User Not Exist");
        setLoggedInUser(null);
        // User is signed out
        // ...
      }
    });
  }, []);
  return (
    <>
      <h1>ACA-Group-Project</h1>
      <Header loggedInUser={loggedInUser} />
      <br />
      <br />
      <br />
      <SignUp />
      <br />
      <br />
      <br />
      <SignIn />
      <br />
      <br />
      <br />
      <Users />
    </>
  );
}

export default App;
