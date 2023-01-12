import React, { useEffect } from "react";
import "./App.css";
import BookManager from "./book/BookManager";
import { setStatus, setPrecision, updateBook } from "./book/bookSlice";
import { Precision } from "./book/types";
import { useAppDispatch, useAppSelector } from "./store";

const bookManager = new BookManager();

function App() {
  const book = useAppSelector(({ asks, bids }) => ({ asks, bids }));
  const precision = useAppSelector(({ precision }) => precision);
  const status = useAppSelector(({ status }) => status);
  const dispatch = useAppDispatch();

  useEffect(() => {
    bookManager.onSubscribed = () => {
      dispatch(setStatus("connected"));
    };

    bookManager.onUpdate = (bookRows) => {
      dispatch(updateBook(bookRows));
    };

    bookManager.start();
  }, []);

  useEffect(() => {
    if (precision) {
      dispatch(setStatus("pending"));
      bookManager.setPrecision(precision);
    }
  }, [precision]);

  const toggleConnect = () => {
    if (status === "connected") {
      dispatch(setStatus("disconnected"));
      bookManager.stop();
    } else if (status === "disconnected") {
      dispatch(setStatus("pending"));
      bookManager.start();
    }
  };

  return (
    <div>
      {["P0", "P1", "P2", "P3", "P4"].map((p) => (
        <button
          key={p}
          disabled={status === "pending"}
          onClick={() => {
            dispatch(setPrecision(p as Precision));
          }}
        >
          {p}
        </button>
      ))}
      <button onClick={toggleConnect} disabled={status === "pending"}>
        {status === "connected" && "Disconnect"}
        {status === "disconnected" && "Connect"}
        {status === "pending" && "..."}
      </button>
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
