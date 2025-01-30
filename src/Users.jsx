import {
  collection,
  getDocs,
  query,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { db } from "./firebase";

function Users() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [n1, setN1] = useState(0);
  const [n2, setN2] = useState(0);
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const getUsers = useCallback(async function () {
    const q = query(collection(db, "user"));

    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
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
    setName("");
    setEmail("");
    setN1(0);
    setN2(0);
    getUsers();
  }

  async function onEditSave(user) {
    if (editingId === user.id) {
      await updateDoc(doc(db, "user", user.id), {
        name: user.name,
        email: user.email,
        numbers: user.numbers,
      });
      setEditingId(null);
    } else {
      setEditingId(user.id);
    }
    getUsers();
  }

  async function onDelete(userId) {
    await deleteDoc(doc(db, "user", userId));
    getUsers();
  }

  function handleInputChange(userId, field, value) {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? field === "numbers"
            ? { ...user, numbers: value }
            : { ...user, [field]: value }
          : user
      )
    );
  }

  return (
    <>
      <div>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="N1"
          value={n1}
          onChange={(e) => setN1(+e.target.value)}
        />
        <input
          type="number"
          placeholder="N2"
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
              <td>
                {editingId === user.id ? (
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) =>
                      handleInputChange(user.id, "name", e.target.value)
                    }
                  />
                ) : (
                  user.name
                )}
              </td>
              <td>
                {editingId === user.id ? (
                  <input
                    type="text"
                    value={user.email}
                    onChange={(e) =>
                      handleInputChange(user.id, "email", e.target.value)
                    }
                  />
                ) : (
                  user.email
                )}
              </td>
              <td>
                {editingId === user.id ? (
                  <input
                    type="number"
                    value={user.numbers[0]}
                    onChange={(e) =>
                      handleInputChange(user.id, "numbers", [
                        +e.target.value,
                        user.numbers[1],
                      ])
                    }
                  />
                ) : (
                  user.numbers[0]
                )}
              </td>
              <td>
                {editingId === user.id ? (
                  <input
                    type="number"
                    value={user.numbers[1]}
                    onChange={(e) =>
                      handleInputChange(user.id, "numbers", [
                        user.numbers[0],
                        +e.target.value,
                      ])
                    }
                  />
                ) : (
                  user.numbers[1]
                )}
              </td>
              <td>
                <button onClick={() => onEditSave(user)}>
                  {editingId === user.id ? "Save" : "Edit"}
                </button>
                <button onClick={() => onDelete(user.id)}>X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Users;
