import _ from "lodash";
import { BookData, BookRow, Precision, SortedBookRows } from "./types";
import { isEventMessage, isSnapshotMessage, isUpdateMessage } from "./utils";

const bfxBookURL = "wss://api-pub.bitfinex.com/ws/2";

class BookManager {
  ws: WebSocket = new WebSocket(bfxBookURL);

  precision: Precision = "P0";

  channelID!: number | null;

  bidPrices: number[] = [];

  bids: { [price: string]: BookRow } = {};

  askPrices: number[] = [];

  asks: { [price: string]: BookRow } = {};

  onUpdate?: (bookRows: SortedBookRows) => any;

  start() {
    if (this.ws.readyState === this.ws.OPEN) {
      this.subscribe();
    } else {
      this.ws.onopen = () => {
        this.subscribe();
      };
    }

    this.ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      if (isEventMessage(data)) {
        this.channelID = data.chanId;
      } else if (isSnapshotMessage(data)) {
        if (this.channelID === data[0]) {
          this.handleSnapshotMessage(data[1]);
        }
      } else if (isUpdateMessage(data)) {
        if (this.channelID === data[0]) {
          this.handleUpdateMessage(data[1]);
        }
      }
    };
  }

  stop() {
    this.ws.send(
      JSON.stringify({ event: "unsubscribe", chanId: this.channelID })
    );
    this.channelID = null;
  }

  getBooks(): SortedBookRows {
    return {
      bids: this.bidPrices.map((price) => this.bids[price]),
      asks: this.askPrices.map((price) => this.asks[price]),
    };
  }

  setPrecision(precision: Precision): boolean {
    // Won't set the new precision while waiting for a new subscription's channel id
    if (!this.channelID) {
      return false;
    }

    const lastChannelId = this.channelID;
    this.channelID = null;
    this.ws.send(
      JSON.stringify({ event: "unsubscribe", chanId: lastChannelId })
    );

    this.precision = precision;
    this.subscribe();

    return true;
  }

  private subscribe() {
    this.reset();
    this.ws.send(
      JSON.stringify({
        event: "subscribe",
        channel: "book",
        symbol: "tBTCUSD",
        prec: this.precision,
      })
    );
  }

  private reset() {
    this.bidPrices = [];
    this.bids = {};
    this.askPrices = [];
    this.asks = {};
  }

  private handleSnapshotMessage(snapshot: BookData[]) {
    snapshot.forEach(([price, count, amount]) => {
      if (count === 0) return;

      if (amount > 0) {
        this.bidPrices.push(price);
        this.bids[price] = { price, count, amount };
      } else if (amount < 0) {
        this.askPrices.push(price);
        this.asks[price] = { price, count, amount };
      }
    });
  }

  private handleUpdateMessage(bookData: BookData) {
    const [price, count, amount] = bookData;
    if (count > 0) {
      // Add / Update book row
      if (amount > 0) {
        // Bids

        // Using sorted index to implement "sorted map"
        // The bids, asks object can't be sorted deterministically in JS runtime.
        // We use bidPrices, askPrices arrays are for keeping the index of prices instead.
        if (!this.bids[price]) {
          const index = _.sortedIndexBy(this.bidPrices, price, (p) => -p);
          this.bidPrices.splice(index, 0, price);
        }

        this.bids[price] = { price, count, amount };
      } else {
        // Asks

        if (!this.asks[price]) {
          const index = _.sortedIndexBy(this.askPrices, price);
          this.askPrices.splice(index, 0, price);
        }

        this.asks[price] = { price, count, amount };
      }
    } else {
      // Delete book row
      if (amount > 0 && this.bids[price]) {
        delete this.bids[price];

        // Find the sorted index for the cached price in price array
        const index = _.sortedIndexBy(this.bidPrices, price, (p) => -p);
        this.bidPrices.splice(index, 1);
      } else if (amount < 0 && this.asks[price]) {
        delete this.asks[price];

        // Find the sorted index for the cached price in price array
        const index = _.sortedIndexBy(this.askPrices, price);
        this.askPrices.splice(index, 1);
      }
    }

    if (this.onUpdate) {
      this.onUpdate(this.getBooks());
    }
  }

  // async stop() {
  //   this.ws.send(JSON.stringify({}));
  // }
}

export default BookManager;
