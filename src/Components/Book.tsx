import React from "react";
import { BookState, BookAction } from "./Bookreducer";

interface BookProps {
  book: BookState;
  dispatch: React.Dispatch<BookAction>;
}

const Book: React.FC<BookProps> = ({ book, dispatch }) => {
  const handleDelete = () => {
    dispatch({ type: "DELETE", payload: book.id });
  };

  return (
    <div className="book">
      <h2>{book.Tittle}</h2>
      <p>{book.Author}</p>
      <p>{book.year_published}</p>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default Book;
