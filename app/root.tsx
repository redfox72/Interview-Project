import {
  Links,
  Scripts,
  ScrollRestoration,
  useFetchers,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";

import type { ActionFunctionArgs, LinksFunction } from "@remix-run/node";

import styles from "./styles/style.css?url";

import { getCrypto, getCryptoOrdering, type CryptoCurrency } from "./data";
import CryptoCard from "./CryptoCard";
import TopBar from "./TopBar";
import { useState } from "react";
import { useInterval } from "./useInterval";

export async function loader(): Promise<{cryptoData: CryptoCurrency[], cryptoOrdering: string[]}> {
  return {cryptoData: await getCrypto(), cryptoOrdering: await getCryptoOrdering()};
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const oldId = formData.get("oldId");
  const newId = formData.get("newId");
  if (!oldId || !newId)
  {
    throw new Response("Missing ID value", {status: 400, statusText: "Missing ID value"});
  }

  const cryptoOrder = await getCryptoOrdering();
  const oldIndex = cryptoOrder.indexOf(String(oldId));
  const newIndex = cryptoOrder.indexOf(String(newId));

  const swapValue = cryptoOrder[newIndex];
  cryptoOrder[newIndex] = cryptoOrder[oldIndex];
  cryptoOrder[oldIndex] = swapValue;

  return {ok: true};
}

function usePendingItems() {
  type PendingItem = ReturnType<typeof useFetchers>[number] & { formData: FormData };

  return useFetchers()
  .filter((fetcher): fetcher is PendingItem => {
    if (!fetcher.formData) return false;
    return fetcher.formData.get("intent") === "moveItem";
  }).map(value => ({oldId: String(value.formData.get("oldId")), newId: String(value.formData.get("newId"))}));
}

export default function App() {
  const [filter, setFilter] = useState<string>("");
  const [autoRefresh, setAutoRefresh] = useState<Boolean>(false);

  const navigate = useNavigate();

  useInterval(() => {
    if (autoRefresh)
    {
      navigate(".", { replace: true });
    }
  }, 5000);

  const crypto = useLoaderData<typeof loader>();
  const sortedCrypto = crypto.cryptoOrdering.map(cryptoCode => crypto.cryptoData
    .find(current => current.code === cryptoCode))
    .filter(current => current !== undefined)
  const pendingItems = usePendingItems();
  for (var pending of pendingItems)
  {
    var oldIndex = sortedCrypto.findIndex(value => value.code === pending.oldId);
    var newIndex = sortedCrypto.findIndex(value => value.code === pending.newId);
    var swapValue = sortedCrypto[newIndex];
    sortedCrypto[newIndex] = sortedCrypto[oldIndex];
    sortedCrypto[oldIndex] = swapValue;
  }
  return (
    <html lang="en">
      <body>
        <Links />
        <TopBar updateFilter={setFilter} updateAutoRefresh={setAutoRefresh} />
        <div className="all-crypto-container">
          {sortedCrypto.filter(current => current.code.toLowerCase().includes(filter) || current.name.toLowerCase().includes(filter)).map(current => <CryptoCard cryptoData={current} />)}
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
