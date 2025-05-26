# Cryptocurrency dashboard

---

## Setup instructions
---
1. Clone this repository to your local machine.
2. Ensure that [NPM/NPX is installed](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm). 
3. Run `npm i` to install dependencies.
4. Run `npm run build`.
5. Run `npm run start` to run as if the server was in production mode.
6. Navigate to [the locally running server](http://localhost:3000)

## Notes/tradeoffs

Included in this repository is the overall function for the cryptocurrency dashboard. `./app/root.tsx` is the main component.

Everything is server sided rendered, and uses optimistic changes when required (IE when changing the order of cards). 

I used the public Coinbase API to get the [current list of cryptocurrencies](https://api.coinbase.com/v2/currencies/crypto), as well as the [exchange rate to USD](https://api.coinbase.com/v2/exchange-rates), and [the exchange rate to BTC](https://api.coinbase.com/v2/exchange-rates?currency=BTC). 

The ordering is initially the return value from the CoinBase API (This could be changed fairly easily by updating the loader within `./app/data.ts`). 

As long as the server is running the order is maintained for all users (this was a tradeoff because user login is not implemented as of yet, but if user login was added would be able to be maintained per user). I went this way instead of `localstorage` so that server side rendering/maintaince of order could be maintained. 

When auto refresh is toggled the server will pull new data from CoinBase every 5 seconds. Clicking the refresh button or reloading the page will reload data immediately. 

The filter input will filter as its text is changed. 

Reordering cards can be done by dragging a card onto the card you want to swap it with. If this is done while the view is filtered the cards will swap their _absolute_ positions (IE with a list of 1, 2, 3, filtering to 1, 3 and swapping to 3, 1 will result in a net list of 3, 2, 1). This was done for ease of implementation. 

