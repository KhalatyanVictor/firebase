import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Both from "./components/Both";
import Users from "./components/Users";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setLoggedInUser(user);
      } else {
        setLoggedInUser(null);
      }
    });
  }, [loggedInUser]);



  return (
    <>
      {/* <h1>ACA-Group-Project</h1> */}
      <Conditional />
    </>
  );
}

export default App;


function Conditional() {
  return <Users />;
//   if (loggedInUser !== null) {
//     return (
//       <>
//         <Router>
//           <Header loggedInUser={loggedInUser} />
//           <Routes>
//             <Route path="/" element={<Both />} />
//             <Route path="*" element={<Navigate to="/" />} />
//           </Routes>
//         </Router>
//       </>
//     );
//   } else {
//     return (
//       <>
//         <Router>
//           <Header loggedInUser={loggedInUser} />
//           <Routes>
//             <Route path="/signin" element={<SignIn />} />
//             <Route path="/signup" element={<SignUp />} />
//             <Route path="*" element={<Navigate to="/signin" />} />
//           </Routes>
//         </Router>
//       </>
//     );
//   }
// }
}