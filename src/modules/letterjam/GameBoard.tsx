import './GameBoard.css';
import { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import HintPopup, { Letter } from './HintPopup';

function GameBoard(playerName: string, errorHandler: Function, onclick = () => void 0) {

    const [loading, setLoading] = useState(true);
    const [gameBoardData, setGameBoardData] = useState<Record<string, string[]>>({});
    const [modalShow, setModalShow] = useState(false);
    const [hintLetters, setHintLetters] = useState<Letter[]>([]);

    useEffect(() => {
        function updateGameBoard() {
            fetch(`/game_board/${playerName}`, {
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    return Promise.reject(response);
                })
                .then((data) => {
                    setGameBoardData(data);
                    setLoading(false);
                })
                .catch((response) => {
                    console.log('gameboard error caught');
                    response.json().then((json: any) => {
                        console.log('gameboard error:');
                        console.log(json);
                        errorHandler(json.error);
                    })
                })
            ;
        };
        updateGameBoard();
        const interval = setInterval(updateGameBoard, 2000);
        return () => clearInterval(interval);
    }, [playerName, errorHandler]);

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

    function handleAdvance() {
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

    function generateLettersForHints() {
        const generateHintforPlayer = (player: string, letters: string[]) => {
            // # TODO: need to have multiple Bonus Letter players  in order to surface multiple bonus letters
            // if (player === 'Bonus Letters') {
            //     return letters.map((a_letter) => {
            //         return {
            //             owner: player,
            //             raw: a_letter,
            //         }
            //     })
            // }
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
        console.log(`inside generateLettersForHints, game board is:`)
        console.log(gameBoardData)
        var hintLettersToSet = Object.keys(gameBoardData).filter(
            function (player: string) {
                return gameBoardData[player].length > 0;
            }
        ).map((player) => {
            return generateHintforPlayer(player, gameBoardData[player])
        })
        setHintLetters(hintLettersToSet)
    };

    useEffect(generateLettersForHints, [gameBoardData]);

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
                    {Object.keys(gameBoardData).map((player) => {
                        return (renderPlayerBoard(player, gameBoardData[player], onclick))
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
                    onClick={handleAdvance}
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
