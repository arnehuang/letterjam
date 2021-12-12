import './GameBoard.css';
import { useState, useEffect } from 'react';

function generateRandomLetter() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  
    return alphabet[Math.floor(Math.random() * alphabet.length)]
  };


function GameBoard(playerName: string, errorHandler: Function) {

    const [gameBoard, setGameBoard] = useState<Record<string, string[]>>({});

    useEffect(() => {
        updateGameBoard();
        const interval = setInterval(() => {
            updateGameBoard();
        }, 30000); //TODO: drop this to 2 seconds when we have a real server
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
    );
}
export default GameBoard;
