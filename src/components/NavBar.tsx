import { useState, useEffect, useRef } from 'react';
import './NavBar.css';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, Navbar } from 'react-bootstrap';
// import io from 'socket.io-client';


export default function NavBar(props: { show_players: boolean }) {
    const hasFetchedData = useRef(false);

    const [state, setState] = useState({
        players: [] as string[],
        loading: true,
    });

    // Component updated -> calls this. 
    useEffect(() => {
        if (!hasFetchedData.current) {
            fetch(`${process.env.REACT_APP_API_URL}/api/players`).then(res => res.json()).then(data => {
                if (data.length > 0) {
                    setState({
                        ...state,
                        players: data,
                        loading: false
                    })
                };
            });
            hasFetchedData.current = true;
        }
    }, [state]);

    var items: string[] = [];
    items = items.concat(state.players);
    if (props.show_players === false) {
        return (
            <Navbar >
                <LinkContainer key={0} to="/">
                    <Nav.Link>Letter Jam</Nav.Link>
                </LinkContainer>
            </Navbar>
        );
    }
    else {
        return (
            <Navbar >
                {
                    items.map((player, index) =>
                        <LinkContainer key={index} to={`/player/${player}`}>
                            <Nav.Link>{player}</Nav.Link>
                        </LinkContainer>)
                }
            </Navbar>
        )
    }
}