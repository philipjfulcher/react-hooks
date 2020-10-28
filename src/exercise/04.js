// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import React from 'react'
import {useLocalStorageState} from '../utils'

function SquaresHistory({squaresHistory = [], currentStep, onStepSelect}) {
  function handleHistoryChange(index) {
    onStepSelect(index)
  }

  return (
    <ol>
      {squaresHistory.map((squares, index) => {
        return (
          <li key={index}>
            <button
              disabled={index === currentStep}
              onClick={() => handleHistoryChange(index)}
            >
              {index === 0 ? 'Go to Game Start' : `Go to move #${index}`}{' '}
              {index === currentStep ? '(current step)' : ''}
            </button>
          </li>
        )
      })}
    </ol>
  )
}

function Board({squares, onSquaresChange}) {
  // 🐨 squares is the state for this component. Add useState for squares

  // 🐨 We'll need the following bits of derived state:
  // - nextValue ('X' or 'O')
  // - winner ('X', 'O', or null)
  // - status (`Winner: ${winner}`, `Scratch: Cat's game`, or `Next player: ${nextValue}`)
  // 💰 I've written the calculations for you! So you can use my utilities
  // below to create these variables

  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)
  const status = calculateStatus(winner, squares, nextValue)

  // This is the function your square click handler will call. `square` should
  // be an index. So if they click the center square, this will be `4`.
  function selectSquare(square) {
    // 🐨 first, if there's already winner or there's already a value at the
    // given square index (like someone clicked a square that's already been
    // clicked), then return early so we don't make any state changes
    if (winner || squares[square] !== null) {
      return
    }
    // 🦉 It's typically a bad idea to mutate or directly change state in React.
    // Doing so can lead to subtle bugs that can easily slip into production.
    //
    // 🐨 make a copy of the squares array
    // 💰 `[...squares]` will do it!)
    const squaresCopy = [...squares]
    // 🐨 set the value of the square that was selected
    // 💰 `squaresCopy[square] = nextValue`
    squaresCopy[square] = nextValue
    // 🐨 set the squares to your copy
    onSquaresChange(squaresCopy)
  }

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      {/* 🐨 put the status in the div below */}
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const [
    squaresHistory,
    setSquaresHistory,
  ] = useLocalStorageState('tic-tac-toe:history', [Array(9).fill(null)])

  const [currentStep, setCurrentStep] = useLocalStorageState('currentStep', 0)

  function handleStepSelect(stepId) {
    setCurrentStep(stepId)
  }

  function handleSquaresChange(squares) {
    let newSquaresHistory
    let nextCurrentStep

    const previousMaxIndex = squaresHistory.length - 1

    if (currentStep === previousMaxIndex) {
      nextCurrentStep = previousMaxIndex + 1
      newSquaresHistory = [...squaresHistory, squares]
    } else {
      nextCurrentStep = currentStep + 1
      newSquaresHistory = [...squaresHistory.splice(0, currentStep + 1, 0), squares]
    }
    setSquaresHistory(newSquaresHistory)
    setCurrentStep(nextCurrentStep)
  }

  function restart() {
    // 🐨 reset the squares
    // 💰 `Array(9).fill(null)` will do it!
    setSquaresHistory([Array(9).fill(null)])
    setCurrentStep(0)
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={squaresHistory[currentStep]}
          onSquaresChange={handleSquaresChange}
        />
        <button className="restart" onClick={restart}>
          restart
        </button>
        <SquaresHistory
          currentStep={currentStep}
          squaresHistory={squaresHistory}
          onStepSelect={handleStepSelect}
        />
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  const xSquaresCount = squares.filter(r => r === 'X').length
  const oSquaresCount = squares.filter(r => r === 'O').length
  return oSquaresCount === xSquaresCount ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
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
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
