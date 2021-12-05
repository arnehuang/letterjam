import './PlayerPage.css';

import React, { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar';
import io from 'socket.io-client';
import { Form, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';


function PlayerPage() {
    const [state, setState] = useState({
        status: '',
        loading: true,
    });
    console.log(useParams());
    const playerName = useParams().id;
    console.log(playerName);

    const updateStatus = (status: string) => {
        setState({
            ...state,
            status: status,
            loading: false
        });
    };

    useEffect(() => {
        fetch('/status').then(res => res.json()).then(data => {
            updateStatus(data);
        });
    }, []);

    return (
        <div className="App" >
            <div className="Navbar Form-text">
                <NavBar {... { show_players: false }} />
            </div>
            {/* Game Board here */}
            game_board for player
            {/* History Log here */}
            history_log
            {/* hinting button here, opens hint interface */}
            hint
            {/* advance button here */}
            advance
        </div>
    );
}

export default PlayerPage;
