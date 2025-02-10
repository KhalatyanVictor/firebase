import {
  collection,
  getDocs,
  query,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  limit,
  startAfter,
  getCountFromServer,
  where,
} from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { db } from "../firebase/firebase";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { debounce } from "lodash";
const USERS_PER_PAGE = 3;

function Users() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [n1, setN1] = useState(0);
  const [n2, setN2] = useState(0);
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(1);
  const snapshots = useRef([]);
  const [allUsersCount, setAllUsersCount] = useState(0);
  const [search, setSearch] = useState("");
  const [dSearch, setDSearch] = useState(search);

  // eslint-disable-next-line
  const debounceFunction = useCallback(
    debounce((search) => {
      setDSearch(search);
    }, 1000),
    []
  );
  useEffect(() => {
    debounceFunction(search);
  }, [search, debounceFunction]);
  const getTotalCount = useCallback(async (search) => {
    const collRef = search
      ? query(collection(db, "user"), where("name", "==", search))
      : collection(db, "user");
    const snapshot = await getCountFromServer(collRef);
    setAllUsersCount(snapshot.data().count);
  }, []);

  useEffect(() => {
    getTotalCount(dSearch);
  }, [getTotalCount, dSearch]);

  const handleChange = (event, value) => {
    setPage(value);
  };

  const getUsers = useCallback(async function (p, search) {
    let q = search
      ? query(
          collection(db, "user"),
          limit(USERS_PER_PAGE),
          where("name", "==", search)
        )
      : query(collection(db, "user"), limit(USERS_PER_PAGE));
    if (p !== 1) {
      const lastVisible =
        snapshots.current.docs[snapshots.current.docs.length - 1];
      q = search
        ? query(
            collection(db, "user"),
            limit(USERS_PER_PAGE),
            startAfter(lastVisible),
            where("name", "==", search)
          )
        : query(
            collection(db, "user"),
            limit(USERS_PER_PAGE),
            startAfter(lastVisible)
          );
    }

    const querySnapshot = await getDocs(q);
    snapshots.current = querySnapshot;
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    setUsers(data);
  }, []);

  useEffect(() => {
    getUsers(page, dSearch);
  }, [getUsers, page, dSearch]);

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

  console.log(users);

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
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
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
      <Stack spacing={2}>
        <Typography>Page: {page}</Typography>
        <Pagination
          count={Math.ceil(allUsersCount / USERS_PER_PAGE)}
          page={page}
          onChange={handleChange}
        />
      </Stack>
    </>
  );
}

export default Users;
