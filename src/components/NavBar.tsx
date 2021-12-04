import React, { useState, useEffect } from 'react';
import './NavBar.css';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, Navbar } from 'react-bootstrap';
import io from 'socket.io-client';


export default function NavBar(props: {show_players: boolean}) {
    const [state, setState] = useState({
        players: [] as any[],
        loading: true,
    });

    const updatePlayers = (players: any[]) => {
        if (players.length > 0) {
            setState({
                ...state,
                players: players,
                loading: false
            })
        }
    };

    useEffect(() => {
        fetch('/players').then(res => res.json()).then(data => {
        updatePlayers(data);
        });
    }, []);

    var items: string[] = [];
    if (props.show_players === true) {
        items = items.concat(state.players);
    }
    return (
        <Navbar style={{backgroundColor: "#282c34"}}>
            <LinkContainer key={0} to="/">
                <Nav.Link>Letter Jam</Nav.Link>
            </LinkContainer>
            {items.map((player, index) =>
                <LinkContainer key={index} to={`/current_status/${JSON.parse(player)._name}`}>
                    <Nav.Link>{JSON.parse(player)._name}</Nav.Link>
                </LinkContainer>)}
        </Navbar>
    )
}