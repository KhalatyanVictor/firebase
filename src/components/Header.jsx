import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

function Header({ loggedInUser }) {
  function onLogOutClick() {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });
  }
  return (
    <div
      style={{
        display: "flex-end",
      }}
    >
      {loggedInUser ? (
        <>
          <span>{loggedInUser.email}</span>
          <button onClick={onLogOutClick}>Log Out</button>
        </>
      ) : (
        "No Logged In User"
      )}
    </div>
  );
}

export default Header;
