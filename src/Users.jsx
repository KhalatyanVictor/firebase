import {
  collection,
  getDocs,
  query,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { db } from "./firebase";

function Users() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [n1, setN1] = useState(0);
  const [n2, setN2] = useState(0);
  const [users, setUsers] = useState([]);

  const getUsers = useCallback(async function () {
    const q = query(collection(db, "user"));

    const querySnapshot = await getDocs(q);
    //   console.log(querySnapshot);
    const data = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      data.push({ id: doc.id, ...doc.data() });
    });
    setUsers(data);
  }, []);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  async function onAddClick() {
    await addDoc(collection(db, "user"), {
      name,
      email,
      numbers: [n1, n2],
    });
    getUsers();
  }

  async function deleteUser(userId) {
    await deleteDoc(doc(db, "user", userId));
    getUsers();
  }

  return (
    <>
      <div>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          value={n1}
          onChange={(e) => setN1(+e.target.value)}
        />
        <input
          type="text"
          value={n2}
          onChange={(e) => setN2(+e.target.value)}
        />
        <button onClick={onAddClick}>Add</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>
              <b>Id</b>
            </th>
            <th>
              <b>Name</b>
            </th>
            <th>
              <b>Email</b>
            </th>
            <th>
              <b>N1</b>
            </th>
            <th>
              <b>N2</b>
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.numbers[0]}</td>
              <td>{user.numbers[1]}</td>
              <td>
                <button onClick={() => deleteUser(user.id)}>X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Users;
