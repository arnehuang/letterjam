import React, { useState, useEffect } from 'react';
import './NavBar.css';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, Navbar } from 'react-bootstrap';
import io from 'socket.io-client';


export default function NavBar(props: { show_players: boolean }) {
    const [state, setState] = useState({
        players: [] as string[],
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
    items = items.concat(state.players);
    if (props.show_players === false) {
        return (
            <Navbar >
                <LinkContainer key={0} to="/">
                    <Nav.Link>Letter Jam</Nav.Link>
                </LinkContainer>
            </Navbar>
        );
    }
    else {
        return (
            <Navbar >

                {
                    items.map((player, index) =>
                        <LinkContainer key={index} to={`/current_status/${player}`}>
                            <Nav.Link>{player}</Nav.Link>
                        </LinkContainer>)
                }
            </Navbar>
        )
    }
}