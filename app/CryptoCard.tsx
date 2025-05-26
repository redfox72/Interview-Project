import React, { useState } from "react";
import { getCrypto, type CryptoCurrency } from "./data";
import { data, useSubmit } from "@remix-run/react";
import invariant from "tiny-invariant";
import { ActionFunctionArgs } from "@remix-run/node";

export async function action() {

}

export default function CryptoCard({cryptoData}: { cryptoData: CryptoCurrency }){

    let [acceptDrag, setAcceptDrag] = useState<"none" | "accept">("none");
    let submit = useSubmit();

    return (
    <div className={"code-container" + (acceptDrag === "accept" ? " accept-drag" : "")}
    draggable 
    onDragStart={(event) => {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("card", JSON.stringify(cryptoData));
    }}
    onDragOver={(event) => {
        if (event.dataTransfer.types.includes("card"))
        {
            event.preventDefault();
            event.stopPropagation();
            setAcceptDrag("accept");
        }
    }}
    onDragLeave={() => {
        setAcceptDrag("none");
    }}
    onDrop={(event) => {
        event.stopPropagation();
        const transfer = JSON.parse(event.dataTransfer.getData("card"));
        invariant(transfer.code, "We need to have a code to change with");

        submit({oldId: transfer.code, newId: cryptoData.code, intent: "moveItem"}, 
            {
                action: "",
                method: "POST",
                navigate: false,
                fetcherKey: `${transfer.code}:${cryptoData.code}`
            }
        );
        setAcceptDrag("none");
    }}>
        <div className="code-title">{cryptoData.code}</div>
        <div className="code-name">{cryptoData.name}</div>
        <div className="code-exchangeUSD">${cryptoData.exchangeToUSD}</div>
        <div className="code-exchangeBTC">{cryptoData.exchangeToBTC} BTC</div>
    </div>
    );
}