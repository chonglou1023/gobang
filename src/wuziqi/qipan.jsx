import Square from './qizi';
import './qipan.css'

function Board({ squares, onPlay, area, isDone }) {
    function handleClick(i, j) {
        if (isDone || squares[i][j]) {
            return;
        }
        onPlay(i, j);
    }
    return (
        <div className='board'>
            <div className='board-inner'>
                {
                    squares.map((row, i) => (
                        <div className="board-row" key={i}>
                            {row.map((col, j) => (
                                <Square
                                    value={col}
                                    onSquareClick={() => handleClick(i, j)}
                                    key={`${i}_${j}`}
                                    active={area && area.some(t => t[0] === i && t[1] === j)}
                                />
                            ))}
                        </div>
                    ))
                }
            </div>
            
        </div>
    );
}
export default Board;