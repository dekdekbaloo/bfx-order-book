import React, { useEffect, useState } from "react";
import "./App.css";
import BookManager from "./book/BookManager";
import { Precision, SortedBookRows } from "./book/types";

const bookManager = new BookManager();

function App() {
  const [book, setBook] = useState<SortedBookRows>();
  const [precision, setPrecision] = useState<Precision>();

  useEffect(() => {
    bookManager.onUpdate = setBook;
    bookManager.start();
  }, []);

  useEffect(() => {
    if (precision) {
      const result = bookManager.setPrecision(precision);
      console.log(result);
    }
  }, [precision]);

  return (
    <div>
      {["P0", "P1", "P2", "P3", "P4"].map((p) => (
        <button
          key={p}
          onClick={() => {
            setPrecision(p as Precision);
          }}
        >
          {p}
        </button>
      ))}
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
