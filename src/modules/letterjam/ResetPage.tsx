import {useEffect} from 'react';



function ResetPage() {
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/reset`);
    });

    return (
        <div>
            <a href='/'>Reset</a>
        </div>
    )
}

export default ResetPage;
