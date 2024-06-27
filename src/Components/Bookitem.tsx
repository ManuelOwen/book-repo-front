import React, { useRef, useState, useCallback } from "react";
import { BookState, BookAction } from "./Bookreducer";

interface BookItemProps {
  book: BookState;
  dispatch: React.Dispatch<BookAction>;
}

const BookItem: React.FC<BookItemProps> = ({ book, dispatch }) => {
  const [isEditing, setIsEditing] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  const handleUpdate = useCallback(() => {
    if (titleRef.current && authorRef.current && yearRef.current) {
      const updatedBook: BookState = {
        ...book,
        Tittle: titleRef.current.value,
        Author: authorRef.current.value,
        year_published: parseInt(yearRef.current.value),
      };
      dispatch({ type: "UPDATE", payload: updatedBook });
      setIsEditing(false);
    }
  }, [book, dispatch]);

  const handleDelete = useCallback(() => {
    dispatch({ type: "DELETE", payload: book.id });
  }, [book.id, dispatch]);

  return (
    <tr className="book-item">
      <td>{book.Tittle}</td>
      <td>{book.Author}</td>
      <td>{book.year_published}</td>
      <td>
        {isEditing ? (
          <>
            <input ref={titleRef} defaultValue={book.Tittle} />
            <input ref={authorRef} defaultValue={book.Author} />
            <input ref={yearRef} defaultValue={book.year_published.toString()} />
            <button className="edit-button" onClick={handleUpdate}>Update</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </>
        ) : (
          <>
            <button className="edit-button" onClick={() => setIsEditing(true)}>Edit</button>
            <button className="delete-button" onClick={handleDelete}>Delete</button>
          </>
        )}
      </td>
    </tr>
  );
};

export default BookItem;
