import './HistoryLog.css';
import { useState, useEffect, useCallback } from 'react';

function HistoryLog(playerName: string, errorHandler: Function) {

    const [historyLog, setHistoryLog] = useState<Array<string>>([]);

    const updateHistoryLog = useCallback(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/history_log/${playerName}`, {
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
    }, [playerName, errorHandler]);

    useEffect(() => {
        updateHistoryLog();
        const interval = setInterval(() => {
            updateHistoryLog();
        }, 2000);
        return () => clearInterval(interval);
    }, [updateHistoryLog]);

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
