import { useState } from 'react';
import './App.css';

function Square({ value, onSquareClick, active }) {
  return (
    <button className={`square ${active ? 'active' : ''}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i, j) {
    let t = i * 3 + j
    if (calculateWinner(squares) || squares[t]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[t] = 'X';
    } else {
      nextSquares[t] = 'O';
    }
    onPlay(nextSquares, [i, j]);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner[0];
  } else {
    if (squares.some(s => s === null)) {
      status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    } else {
      status = 'Draw';
    }
  }

  return (
    <>
      <div className="status">{status}</div>
      {
        Array.from({ length: 3 }, (_, i) => (
          <div className="board-row" key={i}>
            {Array.from({ length: 3 }, (_, j) => (
              <Square
                value={squares[i * 3 + j]}
                onSquareClick={() => handleClick(i, j)}
                key={i * 3 + j}
                active={winner && winner[1].includes(i * 3 + j)}
              />
            ))}
          </div>
        ))
      }
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [historyMove, setHistoryMove] = useState([]);
  const [currentMove, setCurrentMove] = useState(0);
  const [desc, setDesc] = useState(false);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares, pos) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    const nextHistoryMove = [...historyMove, pos];
    setHistory(nextHistory);
    setHistoryMove(nextHistoryMove);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move + ' (' + historyMove[move - 1].join(', ') + ')';
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  const toggleDesc = () => {
    setDesc(!desc);
  };

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={toggleDesc}>降序</button>
        <ol>{desc ? moves.reverse() : moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return null;
}
