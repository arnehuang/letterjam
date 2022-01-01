import './PlayerPage.css';

import { useState, useEffect, useCallback } from 'react';
import NavBar from '../../components/NavBar';
// import io from 'socket.io-client';
import { Alert, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import GameBoard from './GameBoard';
import HistoryLog from './HistoryLog';

function PlayerPage() {
    const [state, setState] = useState({
        showError: false,
        errorMessage: '',
        loading: true,
    });
    const [status, setStatus] = useState('');

    useEffect(() => {
        updateStatus();
        const interval = setInterval(() => {
            updateStatus();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const playerName = useParams().id || 'Unknown Player';

    const errorHandler = useCallback(
        (error: string) => {
            setState({
                showError: true,
                errorMessage: error,
                loading: false,
            });
        }, []
    );
    
    const updateStatus = () => {
        fetch('/status').then(res => res.json()).then(data => {
            setStatus(data);
        });
    }

    const alertPopup = () => {
        if (state.showError) {
            return (
                <Alert variant="danger" onClose={() => setState({ ...state, showError: false })} dismissible
                    style={{ maxWidth: '200px' }}
                >
                    <Alert.Heading>Error: </Alert.Heading>
                    {state.errorMessage}
                </Alert>
            )
        }
    };

    const _startGame = () => {
        return fetch(`/start_game`, {
            'method': 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return Promise.reject(response);
            })
            .then((data) => {
            })
            .catch((response) => {
                response.json().then((json: any) => {
                    console.log('error caught');
                    console.log(json);
                    setState({ ...state, showError: true, errorMessage: json.error })
                })
            }).finally(() => {
                updateStatus();
            });
        ;
    }

    const renderGame = () => {
        return (
            GameBoard(playerName, errorHandler)
        )
    };

    // Must render the game board first other wise React hooks are out of order
    const renderedGameBoard = renderGame();

    return (
        <div
            className="bg"
        >
            <div className="Navbar Form-text">
                <NavBar {... { show_players: false }} />
            </div>
            {alertPopup()}
            <div className="player-page-contents">
                {
                    status === 'waiting_to_start' &&
                    <Button
                        className="start-game-button"
                        variant="success"
                        onClick={() => { _startGame() }}
                    >
                        Start Game
                    </Button>
                }
                {status === 'in_progress' &&
                    renderedGameBoard
                }
                {HistoryLog(playerName, errorHandler)}
            </div>
        </div>
    );
}

export default PlayerPage;
