import { Form, useNavigate } from "@remix-run/react"
import { useState } from "react";


export default function TopBar({ updateFilter, updateAutoRefresh }: { updateFilter: (arg: any) => any, updateAutoRefresh: (arg: any) => any}) {

    const navigate = useNavigate();
    return (
        <Form className="refresh-form" replace>
            <div>
                Auto Refresh: 
                <input type="checkbox" 
                name="auto-refresh" 
                onChange={(event) => {
                    updateAutoRefresh(event.target.checked);
                }}/>
            </div>
            <div>
                <input type="button"
                name="refresh-once" 
                value="Refresh"
                onClick={() => {
                    navigate('.', { replace: true });
                }}></input>
            </div>
            <div>
                Filter: <input type="text" name="filter" onChange={(event)=> {
                    event.preventDefault();
                    updateFilter(event.target.value.toLowerCase());
                }}/>
            </div>
        </Form>
    )
}