import React from "react";
import { useAppSelector } from "../app/store";

const BookRows: React.FC = () => {
  const book = useAppSelector(({ asks, bids }) => ({ asks, bids }));

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
};

export default BookRows;
