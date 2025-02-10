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
import { db } from "../firebase/firebase";

function FavBooks() {
  const [bookName, setBookName] = useState("");
  const [year, setYear] = useState(0);
  const [favBooks, setFavBooks] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const getFavBooks = useCallback(async function () {
    const q = query(collection(db, "favoriteBook"));

    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    setFavBooks(data);
  }, []);

  useEffect(() => {
    getFavBooks();
  }, [getFavBooks]);

  async function onAddClick() {
    await addDoc(collection(db, "favoriteBook"), {
      bookName,
      year,
    });
    setYear(0);
    getFavBooks();
  }

  async function onEditSave(user) {
    if (editingId === user.id) {
      await updateDoc(doc(db, "favoriteBook", user.id), {
        bookName: user.bookName,
        year: user.year,
      });
      setEditingId(null);
    } else {
      setEditingId(user.id);
    }
    getFavBooks();
  }

  async function onDelete(userId) {
    await deleteDoc(doc(db, "favoriteBook", userId));

    getFavBooks();
  }

  function handleInputChange(userId) {
    setFavBooks((prevUsers) => prevUsers.map((user) => user.id === userId));
  }

  console.log(favBooks);

  return (
    <>
      <div>
        <input
          type="text"
          placeholder="Book Name"
          value={bookName}
          onChange={(e) => setBookName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(+e.target.value)}
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
          {favBooks.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                {editingId === user.id ? (
                  <input
                    type="text"
                    value={user.bookName}
                    onChange={(e) =>
                      handleInputChange(user.id, "bookName", e.target.value)
                    }
                  />
                ) : (
                  user.bookName
                )}
              </td>
              <td>
                {editingId === user.id ? (
                  <input
                    type="text"
                    value={user.year}
                    onChange={(e) =>
                      handleInputChange(user.id, "year", +e.target.value)
                    }
                  />
                ) : (
                  user.year
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

export default FavBooks;
