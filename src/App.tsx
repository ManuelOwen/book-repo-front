import React, { useState, useReducer, useRef, useCallback, useEffect } from "react";
import axios from "./axios/UseAxios";
import BookItem from "./Components/Bookitem";
import { BookReducer, BookState } from "./Components/Bookreducer";
import "./App.css";

const App: React.FC = () => {
  const [books, dispatch] = useReducer(BookReducer, []);
  const [filteredBooks, setFilteredBooks] = useState<BookState[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const booksPerPage = 5;

  const titleRef = useRef<HTMLInputElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("/api/Books");
        dispatch({ type: "LOAD", payload: response.data });
      } catch (error) {
        console.error("Error fetching books", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    setFilteredBooks(
      books.filter((book) =>
        book.Tittle.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setCurrentPage(1);
  }, [searchTerm, books]);

  const addBook = async () => {
    if (titleRef.current && authorRef.current && yearRef.current) {
      if (
        titleRef.current.value.trim() === "" ||
        authorRef.current.value.trim() === "" ||
        yearRef.current.value.trim() === ""
      ) {
        alert("Please add a book!");
        return;
      }

      const newBook = {
        Tittle: titleRef.current.value,
        Author: authorRef.current.value,
        year_published: parseInt(yearRef.current.value),
      };

      try {
        const response = await axios.post("/api/Book", newBook);
        dispatch({ type: "ADD", payload: response.data });
        titleRef.current.value = "";
        authorRef.current.value = "";
        yearRef.current.value = "";
        alert("Book added successfully!");
      } catch (error) {
        console.error("Error adding book", error);
        alert("Failed to add book");
      }
    }
  };

  const handlePagination = useCallback(
    (direction: "next" | "prev") => {
      if (
        direction === "next" &&
        currentPage * booksPerPage < filteredBooks.length
      ) {
        setCurrentPage(currentPage + 1);
      } else if (direction === "prev" && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    },
    [currentPage, filteredBooks.length]
  );

  const currentBooks = filteredBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  return (
    <div className="App">
      <h1>Book Repository</h1>
      <div className="form-container">
        <input ref={titleRef} placeholder="Title" required />
        <input ref={authorRef} placeholder="Author" required />
        <input ref={yearRef} placeholder="Publication Year" required />
        <button onClick={addBook}>Add Book</button>
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by title"
        className="search"
      />
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <table className="book-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Year Published</th>
              <th>Events</th>
            </tr>
          </thead>
          <tbody>
            {currentBooks.map((book) => (
              <BookItem key={book.id} book={book} dispatch={dispatch} />
            ))}
          </tbody>
        </table>
      )}
      <div className="pagination">
        <button onClick={() => handlePagination("prev")}>Previous</button>
        <button onClick={() => handlePagination("next")}>Next</button>
      </div>
    </div>
  );
};

export default App;
