import {useEffect} from 'react';



function ResetPage() {
    useEffect(() => {
        fetch('/reset');
    });

    return (
        <div>
            <a href='/'>Reset</a>
        </div>
    )
}

export default ResetPage;
