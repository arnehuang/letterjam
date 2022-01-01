import './HintPopup.css';
import { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

export type Letter = {
    owner: string;
    raw: string;
}

function HintPopup(
    props: {
        hintgiver: string;
        show: boolean;
        onHide: () => void;
        errorhandler: Function;
        letters: Letter[];
    }
) {
    const [letters, setLetters] = useState([] as Letter[]);
    const [hints, setHints] = useState([] as Letter[]);

    useEffect(() => {
        console.log('letters updated')
        console.log(props.letters)
        setLetters(
            [
                ...props.letters,
                { owner: 'custom', raw: "{}" },
                { owner: 'wild', raw: "*" },
                { owner: 'space', raw: " " },
            ]
        )
    }, [props.letters]);

    function HintBoard() {

        const renderCurrentHint = () => {
            return (
                hints.map(hint => hint.raw)
            );
        };

        const renderPlayerHint = (letter: Letter) => {
            return (<div key={`player-hint-${letter.owner}`} className="hint-player-board">
                {renderLetter(letter)}
                < div className="player-board-header">
                    {letter.owner}
                </div>
            </div>
            );
        }
        const renderLetter = (letter: Letter) => {
            return (
                <Button
                    className="hint-letter-button"
                    key={`hint-letter-button-${letter.owner}`}
                    onClick={() => letterClicked(letter)}
                >
                    {
                        letter.raw
                    }
                </Button>
            )
        }

        return (
            <div className="game-board">
                <div className="hint-board-hint">
                    Current hint is:  {renderCurrentHint()}
                </div>

                <div className="game-board-players">
                    {letters.map((letter) => {
                        return (renderPlayerHint(letter))
                    })}
                </div>
            </div>
        )
    }

    const handleSubmitHint = (event: any) => {
        return fetch(`/api/hint/${props.hintgiver}`, {
            'method': 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                letters: hints
            })
        }).then((response) => {
            if (response.ok) {
                return response.json();
            }
            return Promise.reject(response);
        }).then((data) => {
        }).catch((response) => {
            response.json().then((json: any) => {
                console.log('error caught in Hint Popup');
                console.log(json);
                props.errorhandler(json.error)
            })
        }).finally(() => {
            props.onHide();
        });
    };

    function letterClicked(letter: Letter) {
        setHints(
            [...hints,
            {
                raw: letter.raw,
                owner: letter.owner,
            },
            ]
        );
    };

    return (
        <Modal
            // className="hint-popup"
            show={props.show}
            onHide={props.onHide}
            backdrop="static"
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Click Tiles to Give Hints
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {HintBoard()}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={() => setHints([])}>Clear</Button>
                <Button onClick={handleSubmitHint}>Give Hint</Button>
            </Modal.Footer>
        </Modal>
    );
}
export default HintPopup;
