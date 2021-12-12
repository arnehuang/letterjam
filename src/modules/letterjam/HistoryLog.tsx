import './HistoryLog.css';
import { useState, useEffect } from 'react';

function HistoryLog(playerName: string, errorHandler: Function) {

    const [historyLog, setHistoryLog] = useState<Array<string>>([]);

    useEffect(() => {
        updateHistoryLog();
        const interval = setInterval(() => {
            updateHistoryLog();
        }, 30000); //TODO: drop this to 2 seconds when we have a real server
        return () => clearInterval(interval);
    }, []);

    const updateHistoryLog = () => {
        fetch(`/history_log/${playerName}`, {
        }).then((response) => {
            if (response.ok) {
                return response.json();
            }
            return Promise.reject(response);
        })
            .then((data) => {
                setHistoryLog(data);
            })
            .catch((response) => {
                response.json().then((json: any) => {
                    errorHandler(json.error )
                })
            });
    };

    const renderHistoryMessage = (logMessage: String, index: number) => {
        return (
            <div key={`log-message-${index}`} className="history-log-message">
                {logMessage}
            </div>)
    };
    
    return (

            <div className="history-log">
                <div className="history-log-header">
                    <h3>History Log</h3>
                </div>
                <div className="history-log-messages">
                    {historyLog.map((log, index) => {
                        return renderHistoryMessage(log, index)
                    })}
                </div>
            </div>
    );
}
export default HistoryLog;
