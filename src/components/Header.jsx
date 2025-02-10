import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

function Header({ loggedInUser }) {
  function onLogOutClick() {
    signOut(auth)
      .then(() => {})
      .catch((error) => {
        console.error(error);
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
