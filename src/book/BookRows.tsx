import clsx from "clsx";
import React from "react";
import { useAppSelector } from "../app/store";
import styles from "./BookRows.module.scss";
import { calculateDepths } from "./utils";

const BookRows: React.FC = () => {
  const status = useAppSelector(({ status }) => status);
  const book = useAppSelector(({ asks, bids }) => ({ asks, bids }));
  const bidDepths = calculateDepths(book.bids);
  const askDepths = calculateDepths(book.asks);

  return (
    <div
      className={clsx(styles.BookRows, status === "pending" && styles.pending)}
    >
      <div className={styles.bookSide}>
        <div className={clsx(styles.header, styles.bidSide)}>
          <div>Count</div>
          <div>Amount</div>
          <div>Total</div>
          <div>Price</div>
        </div>
        {book?.bids.map((bid, i) => (
          <div className={clsx(styles.bookRow, styles.bidSide)} key={bid.price}>
            <div>{bid.count}</div>
            <div>{bid.amount.toFixed(4)}</div>
            <div>{bidDepths[i].toFixed(4)}</div>
            <div>{bid.price}</div>
          </div>
        ))}
      </div>
      <div className={styles.bookSide}>
        <div className={styles.header}>
          <div>Price</div>
          <div>Total</div>
          <div>Amount</div>
          <div>Count</div>
        </div>
        {book?.asks.map((ask, i) => (
          <div className={styles.bookRow} key={ask.price}>
            <div>{ask.price}</div>
            <div>{Math.abs(askDepths[i]).toFixed(4)}</div>
            <div>{Math.abs(ask.amount).toFixed(4)}</div>
            <div>{ask.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookRows;
