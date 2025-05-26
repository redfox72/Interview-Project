export type CryptoCurrency = {
  code: string;
  name: string;
  exchangeToUSD: string;
  exchangeToBTC: string;
};

export type CoinBaseCurrencyResponse = {
  data: Array<{
    code: string;
    name: string;
  }>;
}

export type ExchangeResponse = {
  data: {
    currency: string;
    rates: {
      [key: string]: string;
    }
  }
}

let cryptoOrdering: CryptoCurrency["code"][] = [];

export async function getCryptoOrdering(): Promise<string[]> {
  return cryptoOrdering;
}

export async function getCrypto(): Promise<CryptoCurrency[]>
{
  const [currencies, exchangeFromUSD, exchangeFromBTC] = await Promise.all([fetch('https://api.coinbase.com/v2/currencies/crypto'), fetch('https://api.coinbase.com/v2/exchange-rates'), fetch('https://api.coinbase.com/v2/exchange-rates?currency=BTC')]);
  if (!currencies.ok || !exchangeFromUSD.ok || !exchangeFromBTC.ok)
  {
    throw new Error(`${currencies.statusText}\n${exchangeFromUSD.statusText}\n${exchangeFromBTC.statusText}`);
  }
  const USDExchange = JSON.parse(await exchangeFromUSD.text()) as ExchangeResponse;
  const BTCExchange = JSON.parse(await exchangeFromBTC.text()) as ExchangeResponse;
  try {
    const cryptos = JSON.parse(await currencies.text()).data
      .map((currency: CoinBaseCurrencyResponse["data"][0]) => ({
      code: currency.code, 
      name: currency.name, 
      exchangeToUSD: String(1 / Number(USDExchange.data.rates[currency.code])), // note that this could be changed to manage a level of rounding if wanted.
      exchangeToBTC: String(1 / Number(BTCExchange.data.rates[currency.code]))})) as CryptoCurrency[];
      if (cryptoOrdering.length < cryptos.length)
      {
        for (var crypto of cryptos)
        {
          if (!cryptoOrdering.includes(crypto.code))
          {
            cryptoOrdering.push(crypto.code);
          }
        }
      }
      return cryptos;
  } catch (e: any)
  {
    console.log(e);
    return [];
  }
  
}