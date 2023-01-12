import clsx from "clsx";
import _ from "lodash";
import React from "react";
import { useAppSelector } from "../app/store";
import styles from "./BookRows.module.scss";
import { calculateDepths } from "./utils";

const BookRows: React.FC = () => {
  const status = useAppSelector(({ status }) => status);
  const book = useAppSelector(({ asks, bids }) => ({ asks, bids }));
  const bidDepths = calculateDepths(book.bids);
  const askDepths = calculateDepths(book.asks);
  const totalBid = _.last(bidDepths);
  const totalAsk = _.last(askDepths);

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
            {totalBid && (
              <div
                style={{
                  background: "green",
                  position: "absolute",
                  opacity: 0.5,
                  right: 0,
                  height: `100%`,
                  width: `${(100 * bidDepths[i]) / totalBid}%`,
                }}
              />
            )}
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
            {totalAsk && (
              <div
                style={{
                  background: "red",
                  position: "absolute",
                  opacity: 0.5,
                  left: 0,
                  height: `100%`,
                  width: `${(100 * askDepths[i]) / totalAsk}%`,
                }}
              />
            )}
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
