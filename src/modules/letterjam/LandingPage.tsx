import './LandingPage.css';

import React, { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar';
import io from 'socket.io-client';
import { Form, Button } from 'react-bootstrap';


function LandingPage() {
    const [state, setState] = useState({
        status: '',
        loading: true,
    });

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
            {/* <NavBar {... { show_players: true }} /> */}
            <div
                className='p-5 text-center App-bg'
                style={{
                    backgroundImage: `url(${process.env.PUBLIC_URL}/img/enter.png)`
                }}
            >
                <div className='App-content'>
                    <img src="/img/x.png" className="App-logo" alt="yum!" />
                    <Form className="Form-group">
                        <Form.Group className="mb-3 Form-text" controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="name" placeholder="" />
                        </Form.Group>
                        <Form.Group className="mb-3 Form-text" controlId="formWord">
                            <Form.Label>Word</Form.Label>
                            <Form.Control type="word" placeholder="" />
                        </Form.Group>
                        <Button variant="primary" type="submit" href={`${process.env.PUBLIC_URL}/player`}>
                            Play
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
