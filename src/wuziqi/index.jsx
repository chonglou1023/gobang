import { useState, useRef, useEffect } from 'react';
import { produce } from 'immer';
import Board from './qipan';
import Square from './qizi';
import { calculateWinner } from './util'
import './index.css'

let n = 15
let t = 30
let currentSquares = new Array(n).fill(new Array(n).fill(null))
const GameStatus = {
    END: -1,
    PREPARE: 0,
    PLAYING: 1,
    WIN: 2,
    LOSE: 3,
    DRAW: 4,

}
function Game() {
    const [squares, setSquares] = useState(currentSquares);
    const [historyMove, setHistoryMove] = useState([]);
    const [currentMove, setCurrentMove] = useState(0);
    const [area, setArea] = useState([]);
    const [time, setTime] = useState(t);
    const interval = useRef(null);
    const [status, setStatus] = useState(GameStatus.PREPARE);
    const isBlack = currentMove % 2 === 0;
    const currentPlayer = isBlack ? 'black' : 'white';
    const nextPlayer = isBlack ? 'white' : 'black';

    useEffect(() => {
        return () => {
            clearInterval(interval.current);
        }
    }, [])
    const startGame = () => {
        setStatus(GameStatus.PLAYING);
        setSquares(currentSquares)
        setHistoryMove([])
        setCurrentMove(0)
        setArea([])
        loop();
    }
    const loop = () => {
        setTime(t);
        clearInterval(interval.current);
        interval.current = setInterval(() => {
            setTime((prev) => {
                if (prev === 0) {
                    setStatus(GameStatus.LOSE);
                    clearInterval(interval.current);
                    return null;
                }
                return prev - 1;
            });

        }, 1000)
    }
    function handlePlay(i, j) {
        const nextSquares = produce(squares, draft => {
            draft[i][j] = isBlack ? 'black' : 'white';
        });
        const nextHistoryMove = produce(historyMove, draft => {
            draft.push([i, j]);
            if (draft.length > 3) {
                draft.shift();
            }
        })

        const area = calculateWinner(nextSquares, [i, j]);
        if (area) {
            setArea(area);
            clearInterval(interval.current);
            setStatus(GameStatus.END);
            let timer = setTimeout(() => {
                setStatus(GameStatus.WIN);
                clearTimeout(timer);
            }, 3000)

        } else {
            setArea([]);
            if (currentMove < n * n - 1) {
                loop()
                setCurrentMove(currentMove + 1);
            } else {
                clearInterval(interval.current);
                setStatus(GameStatus.DRAW);
            }
        }
        setSquares(nextSquares);
        setHistoryMove(nextHistoryMove);



    }

    const toggleDesc = (n) => {
        const num = Math.min(historyMove.length, n);
        const nextSquares = produce(squares, draft => {
            for (let m = 0; m < num; m++) {
                const [i, j] = historyMove[historyMove.length - 1 - m];
                draft[i][j] = null;
            }
        });
        const nextHistoryMove = produce(historyMove, draft => {
            for (let m = num - 1; m >= 0; m--) {
                draft.pop();
            }
        })
        setSquares(nextSquares);
        setHistoryMove(nextHistoryMove);
        setCurrentMove(currentMove - num);
        setArea([]);
        loop()
    };
    let text;
    let winner;
    if (status === GameStatus.WIN) {
        winner = currentPlayer
        text = '胜利';
    } else if (status === GameStatus.LOSE) {
        winner = nextPlayer
        text = '胜利';
    } else if (status === GameStatus.DRAW) {
        text = '平局';
    }
    return (
        <div className="game">
            <div className='game-title'>五子棋</div>
            <div className='game-result'>
                <div className='winner'>
                    {(status === GameStatus.WIN || status === GameStatus.LOSE) && <Square value={winner} />}

                </div>
                <div className={`status ${status === GameStatus.DRAW ? 'draw' : ''}`}>{text}</div>
            </div>
            <div className="game-board">
                {(status === GameStatus.PREPARE || status > GameStatus.PLAYING) && <div className='control'>
                    <div className='start' onClick={startGame}>{status === GameStatus.PREPARE ? '开始游戏' : '再来一局'}</div>
                </div>}


                <div className={`baizi ${status === GameStatus.PLAYING && !isBlack && time < 10 ? 'active' : ''}`}>
                    {status === GameStatus.PLAYING && !isBlack && time}
                </div>
                <Board isDone={area.length > 0} squares={squares} area={area} onPlay={handlePlay} />
                <div className={`heizi ${status === GameStatus.PLAYING && isBlack && time < 10 ? 'active' : ''}`}>
                    {status === GameStatus.PLAYING && isBlack && time}
                </div>
            </div>
            {status === GameStatus.PLAYING && <div className="game-info">
                {historyMove.length > 0 && <button className="btn" onClick={() => toggleDesc(1)}>悔棋一步</button>}
                {historyMove.length > 2 && <button className="btn" onClick={() => toggleDesc(3)}>悔棋三步</button>}
            </div>}
        </div>
    );
}

export default Game;