import React from 'react';
import './NavBar.css';
import { Link } from "react-router-dom";

export default function NavBar () {
return (<nav className="NavBar">
<Link to="/gameboard">Player1</Link> |{" "}
<Link to="/expenses">Expenses</Link>
</nav>)
}