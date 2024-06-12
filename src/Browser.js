import React from "react";
import { BrowserRouter } from 'react-router-dom'
import App from "./App";

export default function Browser(){
    return(
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    )
}