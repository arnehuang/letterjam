import './GameBoard.css';
import { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import HintPopup, { Letter } from './HintPopup';

function GameBoard(playerName: string, errorHandler: Function, onclick = () => void 0) {

    const [loading, setLoading] = useState(true);
    const [gameBoard, setGameBoard] = useState<Record<string, string[]>>({});
    const [modalShow, setModalShow] = useState(false);
    const [hintLetters, setHintLetters] = useState<Letter[]>([]);

    useEffect(() => {
        updateGameBoard();
        const interval = setInterval(() => {
            updateGameBoard();
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        generateLettersForHints();
    }, [gameBoard]);

    const renderPlayerBoard = (player: string, playerBoard: string[], onclick: () => void) => {
        return (
            <div key={`player-board-${player}`} className="player-board">
                < div className="player-board-header">
                    {player}
                </div>
                {playerBoard.filter(
                    function (letter: string) {
                        return letter !== 'PLACEHOLDER';
                    }
                ).map((letter, index) => {
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
                        'REVEALED': '+',
                    }[letter] || letter
                }
            </div>
        )
    };

    const updateGameBoard = () => {
        fetch(`/game_board/${playerName}`, {
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return Promise.reject(response);
            })
            .then((data) => {
                setGameBoard(data);
            })
            .catch((response) => {
                console.log('gameboard error caught');
                response.json().then((json: any) => {
                    console.log('gameboard error:');
                    console.log(json);
                    errorHandler(json.error);
                })
            }).finally(() => {
                setLoading(false);
            });
        ;
    };

    const handleAdvance = () => {
        return fetch(`/advance/${playerName}`, {
            'method': 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then((response) => {
            if (response.ok) {
                return response.json();
            }
            return Promise.reject(response);
        }).catch((response) => {
            response.json().then((json: any) => {
                console.log('error caught advancing');
                console.log(json);
                errorHandler(json.error);
            })
        }).finally(() => {
            updateGameBoard();
        });
    };

    const handleAddBonus = (event: any) => {
        const bonusLetter = event.target.bonusLetterForm.value;
        return fetch(`/bonus_letter`, {
            'method': 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'bonus_letter': bonusLetter
            })
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return Promise.reject(response);
            })
            .catch((response) => {
                response.json().then((json: any) => {
                    console.log('error caught');
                    console.log(json);
                    errorHandler(json.error);
                })
            })
            ;
    };

    const generateLettersForHints = () => {
        const generateHintforPlayer = (player: string, letters: string[]) => {
            for (let i = 0; i < letters.length; i++) {
                if (i === letters.length - 1
                    || letters[i + 1] === 'BLANK'
                    || letters[i + 1] === 'PLACEHOLDER'
                ) {
                    if (letters[i] === 'REVEALED') {
                        return { owner: player, raw: '+' }
                    }
                    return { owner: player, raw: letters[i] }
                }
            }
            return { owner: player, raw: "GODDAMN BUGS" }
        }
        var hintLettersToSet = Object.keys(gameBoard).filter(
            function (player: string) {
                return player !== 'Bonus Letters';
            }
        ).map((player) => {
            return generateHintforPlayer(player, gameBoard[player])
        })
        setHintLetters(hintLettersToSet)
    };

    if (loading
        || hintLetters.length === 0
    ) {
        return <div>Loading...</div>
    }
    return (
        <div className="game-container">
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
            <HintPopup
                hintgiver={playerName}
                show={modalShow}
                onHide={() => setModalShow(false)}
                errorhandler={errorHandler}
                letters={hintLetters}
            />
            <div className="actions">
                <Button
                    className='hint-button'
                    variant="primary"
                    size="lg"
                    onClick={() => { setModalShow(true) }}
                >
                    Hint
                </Button>
                <Button
                    className='success-button'
                    variant="success"
                    size="lg"
                    onClick={() => { handleAdvance() }}
                >
                    Advance
                </Button>
                <Form className="bonus-letter-form-group" onSubmit={handleAddBonus}>
                    <Form.Group className="mb-3 bonus-letter-form-text" controlId="bonusLetterForm">
                        <Form.Label>Bonus Letter</Form.Label>
                        <Form.Control name="bonusLetterForm" placeholder="" />
                    </Form.Group>
                    <Button
                        className='bonus-letter-button'
                        variant="primary"
                        size="lg"
                        type="submit" >
                        Add Bonus
                    </Button>
                </Form>
            </div>
        </div>
    );
}
export default GameBoard;
