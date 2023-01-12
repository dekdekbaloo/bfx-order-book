import clsx from "clsx";
import React from "react";
import { useAppSelector } from "../app/store";
import { Precision } from "./types";
import styles from "./BookActions.module.scss";
interface Props {
  onPrecisionChange: (p: Precision) => void;
  onToggleConnect: () => void;
}

const BookActions: React.FC<Props> = ({
  onPrecisionChange,
  onToggleConnect,
}) => {
  const status = useAppSelector((state) => state.status);
  const precision = useAppSelector((state) => state.precision);

  return (
    <div className={styles.BookActions}>
      <div>
        {["P0", "P1", "P2", "P3", "P4"].map((p) => (
          <button
            key={p}
            disabled={status === "pending"}
            onClick={() => {
              onPrecisionChange(p as Precision);
            }}
            className={clsx(p === precision && styles.active)}
          >
            {p}
          </button>
        ))}
      </div>
      <button onClick={onToggleConnect} disabled={status === "pending"}>
        {status === "connected" && "Disconnect"}
        {status === "disconnected" && "Connect"}
        {status === "pending" && "..."}
      </button>
    </div>
  );
};

export default BookActions;
