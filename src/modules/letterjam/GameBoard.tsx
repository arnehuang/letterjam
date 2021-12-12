import './GameBoard.css';
import { useState, useEffect } from 'react';

function generateRandomLetter() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

    return alphabet[Math.floor(Math.random() * alphabet.length)]
};

const renderPlayerBoard = (player: string, playerBoard: string[], onclick: () => void) => {
    return (
        <div key={`player-board-${player}`} className="player-board">
            < div className="player-board-header">
                {player}
            </div>
            {playerBoard.map((letter, index) => {
                return renderLetter(letter, index, player, onclick)
            })}
        </div>
    )
};

const renderLetter = (letter: string, index: number, player: string, onclick: Function) => {
    return (
        <div
            className="letter-container"
            key={`letter-container-${player}-${index}`}
            onClick={onclick(letter, player)}
        >

            {
                {
                    'BLANK': '?',
                    'REVEALED': '*',
                    'BONUS': generateRandomLetter(),
                }[letter] || letter
            }
        </div>
    )
};

function GameBoard(playerName: string, errorHandler: Function, onclick= () => void 0) {

    const [gameBoard, setGameBoard] = useState<Record<string, string[]>>({});

    useEffect(() => {
        updateGameBoard();
        const interval = setInterval(() => {
            updateGameBoard();
        }, 200000); 
        return () => clearInterval(interval);
    }, []);

    const updateGameBoard = () => {
        fetch(`/game_board/${playerName}`, {
        })
            .then((response) => {
                if (response.ok) {
                    console.log('gameboard 1');
                    return response.json();
                }
                console.log('here2');
                return Promise.reject(response);
            })
            .then((data) => {
                console.log('gameboard 2');
                console.log(data);
                setGameBoard(data);
            })
            .catch((response) => {
                console.log('here4');
                response.json().then((json: any) => {
                    console.log('gameboard error caught');
                    console.log(json);
                    errorHandler(json.error);
                })
            });
    };

    return (
        <div className="game-board">
            <div className="game-board-header">
                <h3>Board State</h3>
            </div>
            <div className="game-board-players">
                {Object.keys(gameBoard).map((player) => {
                    return (renderPlayerBoard(player, gameBoard[player], onclick))
                })}
            </div>
        </div>
    );
}
export default GameBoard;
