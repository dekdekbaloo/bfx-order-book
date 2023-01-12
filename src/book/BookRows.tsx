import clsx from "clsx";
import React from "react";
import { useAppSelector } from "../app/store";
import styles from "./BookRows.module.scss";

const BookRows: React.FC = () => {
  const book = useAppSelector(({ asks, bids }) => ({ asks, bids }));

  return (
    <div className={styles.BookRows}>
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
            <div>{bid.amount}</div>
            <div>{bid.amount {/* Total */}}</div>
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
        {book?.asks.map((ask) => (
          <div className={styles.bookRow} key={ask.price}>
            <div>{ask.price}</div>
            <div>{ask.amount /* Total */}</div>
            <div>{ask.amount}</div>
            <div>{ask.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookRows;
