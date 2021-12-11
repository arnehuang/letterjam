import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';

import './AlertError.css';

// TODO: Finish this component and put it into use
export default function AlertError(props: { showError: boolean; error: string; alertHandler: any; }) {
    const [state, setState] = useState({
        show: props.showError,
        error: props.error,
        handler: props.alertHandler,
    });

    if (state.show) {
        return (
            <Alert variant="danger" onClose={() =>
                // update the parent state to not show the error anymore
                state.handler} dismissible
                style={{ maxWidth: '200px' }}
            >
                <Alert.Heading>Error: </Alert.Heading>
                {state.error}
            </Alert>
        )
    }

}