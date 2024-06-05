import { useState } from "react"

const Square = ({ num, isActive, onClickSquare }) => {
  return <button className={`square${isActive ? ' active' : ''}`} onClick={onClickSquare}>{num}</button>
}

const Board = ({ xIsNext, squares, onPlay }) => {
  // const [lineWinner, setLineWinner] = useState(null)
  // Square click時
  const handleClick = (i) => {
    if (squares[i] || calculateWinner(squares)) return
    const nextSquares = squares.slice()
    // 盤面listのtargetを更新
    if (xIsNext) {
      nextSquares[i] = 'X'
    } else {
      nextSquares[i] = 'O'
    }
    onPlay(nextSquares)
  }

  // 勝敗が確定したかどうかの判定メソッド
  const calculateWinner = (squares) => {
    console.log(squares)
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ]
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {
          winner: squares[a],
          line: [a, b, c]
        }
      }
    }
    return null
  }

  // 勝者判定
  const result = calculateWinner(squares)
  const winner = result && result.winner
  const lineWinner = result && result.line
  console.log(lineWinner)
  let status
  if (winner) {
    status = `Winner: ${winner}`
  } else if (squares.every(square => square)) {
    status = 'draw'
  } else {
    status = `Next Player: ${xIsNext ? 'X' : 'O'}`
  }

  // board element の生成
  const boardRows = []
  for (let i = 0; i < 3; i++) {
    const squareElements = []
    for (let j = 0; j < 3; j++) {
      const squareIndex = i * 3 + j
      squareElements.push(
        <Square row={i + 1} col={j + 1} isActive={lineWinner && lineWinner.includes(squareIndex)} key={squareIndex} num={squares[squareIndex]} onClickSquare={() => handleClick(squareIndex)} />
      )
      // addCoordinate({ row: i + 1, col: j + 1 })
    }
    boardRows.push(
      <div className="board-row" key={i}>
        {squareElements}
      </div>
    )
  }

  return <>
    <div className="status">{status}</div>
    {boardRows}
  </>
}

const Game = () => {
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [currentMove, setCurrentMove] = useState(0)
  const [historyIsAsc, setHistoryIsAsc] = useState(true)
  const coordinates = [
    {row: 1, col: 1},
    {row: 1, col: 2},
    {row: 1, col: 3},
    {row: 2, col: 1},
    {row: 2, col: 2},
    {row: 2, col: 3},
    {row: 3, col: 1},
    {row: 3, col: 2},
    {row: 3, col: 3},
  ]

  // 現在の盤面
  const currentSquares = history[currentMove]
  // 次が「X」であるかどうか
  const xIsNext = currentMove % 2 === 0

  // マス目クリック時
  const handlePlay = (nextSquares) => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
  }

  // 履歴移動
  const jumpTo = (nextMove) => {
    setCurrentMove(nextMove)
  }

  // const handleAddCoordinate = ({row, col}) => {
  //   console.log(row, col)
  // }

  // 履歴のelements
  const moves = history.map((squares, move) => {
    console.log('move', move)
    let coordinate = null
    if (move > 0) {
      const beforeSquares = history[move - 1]
      console.log('beforeSquares', beforeSquares)
      console.log('squares', squares)
      const diffIndex = beforeSquares.findIndex((beforeSquare, index) => beforeSquare !== squares[index])
      console.log('diffIndex', diffIndex)
      coordinate = coordinates[diffIndex]
    }
    const isCurrentMove = move === currentMove
    let description
    if (isCurrentMove) {
      description = 'You are at #' + move + (coordinate ? `(${coordinate.row},${coordinate.col})` : '')
    } else if (move > 0) {
      description = 'move to #' + move + `(${coordinate.row},${coordinate.col})`
    } else {
      description = 'game start'
    }
    return isCurrentMove ?
      (<li key={move}>
        {description}
      </li>)
      :
      (<li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>)
  })

  // 履歴の昇順、降順を切り替える
  const handleSortHistory = () => {
    setHistoryIsAsc(!historyIsAsc)
  }

  return <div className="game">
    <div className="game-board">
      <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
    </div>
    <div className="game-info">
      <button onClick={handleSortHistory}>Sort {historyIsAsc ? 'desc' : 'asc'}</button>
      <ol reversed={!historyIsAsc}>{historyIsAsc ? moves : moves.reverse()}</ol>
    </div>
  </div>
}

export default Game
