import React, { useEffect } from "react";
import styles from "./App.module.scss";
import BookActions from "../book/BookActions";
import BookManager from "../book/BookManager";
import { setStatus, setPrecision, updateBook } from "../book/bookSlice";
import { Precision } from "../book/types";
import { useAppDispatch, useAppSelector } from "./store";
import BookRows from "../book/BookRows";

const bookManager = new BookManager();

const App: React.FC = () => {
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
    <div className={styles.App}>
      <BookActions
        onPrecisionChange={changePrecision}
        onToggleConnect={toggleConnect}
      />
      <BookRows />
    </div>
  );
};

export default App;
