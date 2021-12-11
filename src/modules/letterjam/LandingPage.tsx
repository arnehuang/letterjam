import './LandingPage.css';

import { useState, useEffect, useRef } from 'react';
import NavBar from '../../components/NavBar';
// import AlertError from '../../components/AlertError';
// import io from 'socket.io-client';
import { Alert, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';



function LandingPage() {
    // var socket = io('http://' + document.domain + ':3000');
    // // var socket = io();
    // socket.on('connect', function() {
    //     socket.emit('connection sent', {data: 'I\'m connected!'});
    //     console.log('connection sent')
    // });

    // socket.on('history updated', function(msg) {
    // // socket.on('status updated', function(msg) {
    //     console.log("Status updated to: " + msg.status);
    // });

    const hasFetchedData = useRef(false);

    const [state, setState] = useState({
        status: '',
        loading: true,
        showError: false,
        errorMessage: '',
    });

    const navigate = useNavigate();


    useEffect(() => {
        const updateStatus = (status: string) => {
            console.log('updating status')
            setState({
                ...state,
                status: status,
                loading: false,
            });
        };
    
        if (!hasFetchedData.current) {
            fetch('/status').then(res => res.json()).then(data => {
                updateStatus(data);
            });
            hasFetchedData.current = true;
        }
    }, [state]);

    const alertPopup = () => {
        // return (
        //     <AlertError {..., {show={state.showError},
        //      message={state.errorMessage}}} />
        // );
        if (state.showError) {
            return (
                <Alert variant="danger" onClose={() => setState({ ...state, showError: false })} dismissible
                    style={{ maxWidth: '200px' }}
                >
                    <Alert.Heading>Could not add player</Alert.Heading>
                    {state.errorMessage}
                </Alert>
            )
        }
    };

    const addPlayerForm = () => {
        if (state.status === 'in_progress') {
            return (<h1>Game is in progress</h1>)
        }
        return (
            <Form className="Form-group" onSubmit={handleAddPlayer}>
                <Form.Group className="mb-3 Form-text" controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control name="playerNameForm" placeholder="" />
                </Form.Group>
                <Form.Group className="mb-3 Form-text" controlId="formWord">
                    <Form.Label>Word</Form.Label>
                    <Form.Control name="playerWordForm" placeholder="" />
                </Form.Group>
                <Button
                    className="Form-text"
                    variant="primary"
                    type="submit" >
                    Play
                </Button>
            </Form>
        );
    }

    const handleAddPlayer = (event: any) => {
        event.preventDefault();
        const playerName = event.target.playerNameForm.value;
        const word = event.target.playerWordForm.value;
        return fetch(`/players`, {
            'method': 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    player: playerName,
                    word: word
                }
            )
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return Promise.reject(response);
            })

            .then(data => {
                navigate(`/player/${playerName}`);
            })
            .catch((response) => {
                response.json().then((json: any) => {
                    console.log('error caught');
                    console.log(json);
                    setState({ ...state, showError: true, errorMessage: json.error })
                })
            })
            ;
    }

    return (
        <div className="App" >
            <div
                className='text-center App-bg'
                style={{
                    backgroundImage: `url(${process.env.PUBLIC_URL}/img/enter.png)`
                }}
            >
                <div className='App-content'>
                    {alertPopup()}
                    <img src="/img/x.png" className="App-logo" alt="yum!" />
                    {addPlayerForm()}
                </div>
                <div className="App-footer Form-text">
                    <NavBar {... { show_players: true }} />
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
