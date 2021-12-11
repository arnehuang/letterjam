import './PlayerPage.css';

import { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar';
// import io from 'socket.io-client';
import { Alert, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

function generateRandomLetter() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  
    return alphabet[Math.floor(Math.random() * alphabet.length)]
  };

function PlayerPage() {
    const [state, setState] = useState({
        showError: false,
        errorMessage: '',
        loading: true,
    });
    const [status, setStatus] = useState('')
    const [historyLog, setHistoryLog] = useState<Array<string>>([]);
    const [gameBoard, setGameBoard] = useState<Record<string, string[]>>({});

    useEffect(() => {
        updateGame();
        const interval = setInterval(() => {
            updateGame();
        }, 30000); //TODO: drop this to 2 seconds when we have a real server
        return () => clearInterval(interval);
    }, []);

    const playerName = useParams().id;
    console.log(state);

    function updateGame() {
        updateStatus();
        updateGameBoard();
        updateHistoryLog();
    };

    const updateStatus = () => {
        fetch('/status').then(res => res.json()).then(data => {
            setStatus(data);
        });
    }

    const updateGameBoard = () => {
        fetch(`/game_board/${playerName}`, {
        })
            .then((response) => {
                if (response.ok) {
                    console.log('here1');
                    return response.json();
                }
                console.log('here2');
                return Promise.reject(response);
            })
            .then((data) => {
                console.log('got game board');
                console.log(data);
                setGameBoard(data);
            })
            .catch((response) => {
                console.log('here4');
                response.json().then((json: any) => {
                    console.log('error caught');
                    console.log(json);
                    setState({ ...state, showError: true, errorMessage: json.error })
                })
            });
    };

    const updateHistoryLog = () => {
        fetch(`/history_log/${playerName}`, {
        }).then((response) => {
            if (response.ok) {
                console.log('hist1');
                return response.json();
            }
            return Promise.reject(response);
        })
            .then((data) => {
                console.log('got history log');
                console.log(data);
                setHistoryLog(data);
            })
            .catch((response) => {
                response.json().then((json: any) => {
                    console.log('hist error caught');
                    console.log(json);
                    setState({ ...state, showError: true, errorMessage: json.error })
                })
            });
    };

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
                updateGame();
            });
        ;
    }
    const renderGameBoard = () => {
        return (

            <div className="game-board">
                <div className="game-board-header">
                    <h3>Board State</h3>
                </div>
                <div className="game-board-players">
                    {Object.keys(gameBoard).map((player) => {
                        return (renderPlayerBoard(player, gameBoard[player]))
                    })}
                </div>
            </div>
        )
    };

    const renderPlayerBoard = (player: string, playerBoard: string[]) => {
        console.log(`Player is ${player}, board is ${playerBoard}`)
        return (
            <div key={`player-board-${player}`} className="player-board">
                < div className="player-board-header">
                    {player}
                </div>
                {playerBoard.map((letter, index) => {
                    return renderLetter(letter, index)
                })}
            </div>
        )
    };

    const renderLetter = (letter: string, index: number) => {
        return (
            <div className="letter-container">
                <div className="letter-container-letter">
                    {
                        {
                            'BLANK': '?',
                            'REVEALED': '*',
                            'BONUS': generateRandomLetter(),
                        }[letter] || letter
                    }
                </div>
            </div>
        )
    };

    const renderHistory = () => {
        return (
            <div className="history-log">
                <div className="history-log-header">
                    <h3>History Log</h3>
                </div>
                <div className="history-log-messages">
                    {historyLog.map((log, index) => {
                        return renderHistoryMessage(log, index)
                    })}
                </div>
            </div>
        )
    };

    const renderHistoryMessage = (logMessage: String, index: number) => {
        return (
            <div key={`log-message-${index}`} className="history-log-message">
                {logMessage}
            </div>)
    };

    const renderGame = () => {
        return (
            <div className="game-container">
                {renderGameBoard()}
                <div className="actions">
                    <Button
                        variant="primary"
                        onClick={() => { handleHint() }}
                    >
                        Hint
                    </Button>
                    <Button
                        variant="success"
                        onClick={() => { handleAdvance() }}
                    >
                        Advance
                    </Button>
                </div>
            </div>
        )
    };
    const handleHint = () => {
        // new hint interface to make it easier - click existing players letters and preview hint
        // Hint.tsx
    };

    const handleAdvance = () => {
    };

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
                        variant="success"
                        onClick={() => { _startGame() }}
                    >
                        Start Game
                    </Button>
                }
                {status === 'in_progress' &&
                    renderGame()
                }
                {renderHistory()}
            </div>
        </div>
    );
}

export default PlayerPage;
