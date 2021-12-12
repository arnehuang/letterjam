import './HintPopup.css';
import { useState, useEffect } from 'react';
import { Modal, Container, Row, Col, Button } from 'react-bootstrap';

type Letter = {
    owner: string;
    raw: string;
}

function HintPopup(
    props: {
        hintgiver: string;
        show: boolean;
        onHide: () => void;
        errorhandler: Function;
    }
) {
    const [letters, setLetters] = useState(
        [
            { owner: 'space', raw: ' ' },
            { owner: '-', raw: '-' },
            { owner: '!', raw: '!' },
            { owner: '?', raw: '?' },
            { owner: 'arne', raw: 'e' },
            { owner: 'ellen', raw: 'g' },
        ]
    );
    const [hints, setHints] = useState([] as Letter[]);


    function HintBoard() {
        const renderPlayerHint = (letter: Letter) => {
           return( <div key={`player-hint-${letter.owner}`} className="player-board">
                < div className="player-board-header">
                    {letter.owner}
                </div>
                {renderLetter(letter)}
            </div>
           );
        }
        const renderLetter = (letter: Letter) => {
            return (
                <div
                    className="letter-container"
                    key={`hint-letter-container-${letter.owner}`}
                    // onClick={letterClicked(letter)}
                >

                    {
                        letter.raw
                    }
                </div>
            )
        }
        return (
            <div className="game-board">
                <div className="game-board-players">
                    {letters.map((letter) => {
                        return (renderPlayerHint(letter))
                    })}
                </div>
            </div>
        )
    }

    const handleSubmitHint = (event: any) => {
        return fetch(`/hint/${props.hintgiver}`, {
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
            {...props}
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
                <Button onClick={handleSubmitHint}>Give Hint</Button>
            </Modal.Footer>
        </Modal>
    );
}
export default HintPopup;
