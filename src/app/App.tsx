import React, { useEffect } from "react";
import "./App.css";
import BookActions from "../book/BookActions";
import BookManager from "../book/BookManager";
import { setStatus, setPrecision, updateBook } from "../book/bookSlice";
import { Precision } from "../book/types";
import { useAppDispatch, useAppSelector } from "./store";

const bookManager = new BookManager();

function App() {
  const book = useAppSelector(({ asks, bids }) => ({ asks, bids }));
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

  const changePrecision = (p: Precision) => {
    dispatch(setPrecision(p));
    bookManager.setPrecision(p);
  };

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
      <BookActions
        onPrecisionChange={changePrecision}
        onToggleConnect={toggleConnect}
      />
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
