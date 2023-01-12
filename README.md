# Bitfinex Order Book (Aun Jessada)

## Tech Stacks

- React
- React Redux with Redux ToolKit
- Sass
- Websocket
- Typescript
- BigNumber.js

## Code Architecture

I use feature-based folder structure to organize high-level overview as features then created files based on types inside each.
e.g.

```
app # core component and entry point
- App.tsx
- store.ts
- ...

book # book feature
- BookRows.tsx
- utils.ts
- bookSlice.ts
```

## Technical Notes

### BookManager

I treat book system as side-effect with its own testable business logic including websocket connection, snapshot and update synchronizations. I optimized the sorting of book rows by simulating "sorted map" data structure which sort data right away when a new entry is inserted into the array. Javascript object keys can't be directly sorted so I introduced the sorted part by using another set of price arrays (bidPrices, askPrices). The `object` will contain the actual price, count and amount data.

### Store

I made the main component connect to the `BookManager` via component `useEffect` hook and set all event handlers to dispatch necessary actions to update the store's state

### Components

To gain benefit from `useSelector` to prevent unnecssary renders from unrelated state changes, I split the book view into `BookActions` and `BookRows` components

### SCSS module

I use SCSS module to prevent naming collision and have more organized stylesheet files structure.

# Development

> yarn start
