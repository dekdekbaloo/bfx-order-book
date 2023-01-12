import React, { useEffect, useState } from "react";
import "./App.css";
import BookManager from "./book/BookManager";
import { SortedBookRows } from "./book/types";

function App() {
  const [book, setBook] = useState<SortedBookRows>();

  useEffect(() => {
    const bookManager = new BookManager();
    bookManager.onUpdate = setBook;

    bookManager.start();
  }, []);

  return (
    <div>
      {book?.bids.map((bid) => (
        <pre key={bid.price}>{JSON.stringify(bid)}</pre>
      ))}
      {book?.asks.map((ask) => (
        <pre key={ask.price}>{JSON.stringify(ask)}</pre>
      ))}
    </div>
  );
}

export default App;
