import React, { useState, useEffect } from "react"
import Piece from "./Piece"
import Spot from "./Spot"
import useMousePosition from "./useMousePosition"
import piecesArray from "./piecesArray"
import gameArray from "./gameArray"
import moveList from "./moveList"

const TILE_SIZE = 80;
const BOARD_COORDS = [50, 50];

function Board() {
    const [gameStateArray, setGameStateArray] = useState(gameArray)
    const [possibleMoves, setPossibleMoves] = useState([])
    const [turn, setTurn] = useState('w')
    const [castleStatus, setCastleStatus] = useState([[null, null, null], [null, null, null]])

    const { x, y } = useMousePosition();

    function resetGame() {
        window.location.reload()
    }

    function causesJump(lastC, lastR, newC, newR, pieceType) {
        if (gameStateArray[lastR][lastC][1] !== 'n') {
            // Assume xDif and yDif are equal
            let xDif = newC - lastC
            let yDif = newR - lastR

            if (Math.abs(xDif) > 1 && Math.abs(yDif) > 1) {
                // get the spots inbetween and make sure they are all empty
                for (let d = 1; d < Math.abs(xDif); d++) {
                    if (gameStateArray[lastR + (d*(yDif < 0 ? -1: 1))][lastC + (d*(xDif < 0 ? -1: 1))] !== ' ') {
                        return true
                    }
                }
            } else if (Math.abs(xDif) > 1 && yDif === 0) {
                let direction = (xDif < 0 ? -1: 1)

                for (let d = 1; d < Math.abs(xDif); d++) {
                    if (gameStateArray[lastR][lastC + (d*direction)] !== ' ') {
                        return true
                    }
                }
            } else if (Math.abs(yDif) > 1 && xDif === 0) {
                for (let d = 1; d < Math.abs(yDif); d++) {
                    
                    let direction = (yDif < 0 ? -1: 1)
                    if (gameStateArray[lastR + (d*direction)][lastC] !== ' ') {
                        return true
                    }
                }
            }
        }
    }

    function validMove(lastC, lastR, newC, newR, pieceColor, pieceType) {
        // Don't repeat the same move
        if (lastC === newC && lastR === newR) {
            return false
        }

        // Make sure it is within bounds
        if (lastR < 0 || lastR > 7 || lastC < 0 || lastC > 7) {
            return false
        }

        let thisPiece = `${gameStateArray[lastR][lastC]}`
        // IS THIS A CASTLE MOVE?
        if (thisPiece === 'bk') {
            if (newR === 0 && newC === 6) {
                if (gameStateArray[0][5] === ' ' && gameStateArray[0][6] === ' ') {
                    setCastleStatus((prevStatus) => {
                        let newStatus = [...prevStatus]
                        newStatus[0][2] = true
                        return newStatus
                    })

                    setGameStateArray((prevArray) => {
                        let newArray = [...prevArray]
                        newArray[0][7] = ' '
                        newArray[0][4] = ' '
                        newArray[0][6] = 'bk'
                        newArray[0][5] = 'br'
                        return newArray
                    })

                    return true
                }
            } else if (newR === 0 && newC === 2) {
                if (gameStateArray[0][2] === ' ' && gameStateArray[0][3] === ' ') {
                    setCastleStatus((prevStatus) => {
                        let newStatus = [...prevStatus]
                        newStatus[0][0] = true
                        return newStatus
                    })

                    setGameStateArray((prevArray) => {
                        let newArray = [...prevArray]
                        newArray[0][0] = ' '
                        newArray[0][4] = ' '
                        newArray[0][2] = 'bk'
                        newArray[0][3] = 'br'
                        return newArray
                    })

                    return true
                }
            }
        } else if (thisPiece === 'wk') {
            if (newR === 7 && newC === 6) {
                if (gameStateArray[7][5] === ' ' && gameStateArray[7][6] === ' ') {
                    setCastleStatus((prevStatus) => {
                        let newStatus = [...prevStatus]
                        newStatus[1][2] = true
                        return newStatus
                    })

                    setGameStateArray((prevArray) => {
                        let newArray = [...prevArray]
                        newArray[7][7] = ' '
                        newArray[7][4] = ' '
                        newArray[7][6] = 'wk'
                        newArray[7][5] = 'wr'
                        return newArray
                    })

                    return true
                }
            } else if (newR === 7 && newC === 2) {
                if (gameStateArray[7][2] === ' ' && gameStateArray[7][3] === ' ') {
                    setCastleStatus((prevStatus) => {
                        let newStatus = [...prevStatus]
                        newStatus[1][0] = true
                        return newStatus
                    })

                    setGameStateArray((prevArray) => {
                        let newArray = [...prevArray]
                        newArray[7][0] = ' '
                        newArray[7][4] = ' '
                        newArray[7][2] = 'wk'
                        newArray[7][3] = 'wr'
                        return newArray
                    })

                    return true
                }
            }
        }
        
        for (let i = 0, l = possibleMoves.length; i < l; i++) {
            if (possibleMoves[i][0] === newC && possibleMoves[i][1] === newR) {

                if (causesJump(lastC, lastR, newC, newR)) {
                    return false
                }

                setGameStateArray((prevArray) => {
                    let newArray = [...prevArray]
                    let spotTaken = `${prevArray[newR][newC]}`

                    if (spotTaken === 'wk' && thisPiece !== 'wk') {
                        alert("Black wins!");
                        setTurn('')
                    } else if (spotTaken === 'bk' && thisPiece !== 'bk') {
                        alert("White wins!");
                        setTurn('')
                    }

                    newArray[newR][newC] = thisPiece

                    if (thisPiece[1] === 'p' && (newR === 7 || newR === 0)) {
                        newArray[newR][newC] = `${thisPiece[0]}q`
                    }
                    
                    newArray[lastR][lastC] = ' '
                    return newArray
                })
                return true
            }
        }
    }

    // Clear the possible moves when no pieces are selected
    function clearPossibleMoves() {
        setPossibleMoves([])
    }

    function changeTurn() {
        if (turn === 'w') {
            setTurn('b')
        } else {
            setTurn('w')
        }
    }

    function savePossibleMoves(currentC, currentR, pieceType, pieceColor) {
        // Filter out the obvious impossible moves
        let availableMoves = moveList[pieceType][pieceColor].map((move, i) => {
            let possibleCol = currentC + move[0]
            let possibleRow = currentR + move[1]

            // If this move is within the board boundaries
            if (possibleRow >= 0 && possibleRow <= 7 && possibleCol >= 0 && possibleCol <= 7) {
                let spotPiece = gameStateArray[possibleRow][possibleCol] 
                
                // Pawn rules
                if (pieceType === 'p') {
                    if (i === 0 && spotPiece === ' ') {
                        return [possibleCol, possibleRow]
                    } else if (i > 0 && i < 3) {
                        if (spotPiece !== ' ' && spotPiece[0] !== pieceColor) {
                            return [possibleCol, possibleRow]
                        }
                    } else if (i === 3) {
                        if (currentR === 6 && pieceColor === 'w' && spotPiece === ' ' && gameStateArray[possibleRow+1][possibleCol] === ' ') {
                            return [possibleCol, possibleRow]
                        } else if (currentR === 1 && pieceColor === 'b' && spotPiece === ' ' && gameStateArray[possibleRow-1][possibleCol] === ' ') {
                            return [possibleCol, possibleRow]
                        }
                    }
                }

                // If this move is the opposite color
                else if (spotPiece[0] !== pieceColor) {
                    return [possibleCol, possibleRow]
                }
            }
            return []
        })

        setPossibleMoves([[currentC, currentR], ...availableMoves])
    }

    //Initialize the pieces array
    const pieces = piecesArray.map((spot, i) => {
        return (
                <Piece 
                    key={i}
                    startX={BOARD_COORDS[0] + (spot[1] * TILE_SIZE)}
                    startY={BOARD_COORDS[1] + (spot[0] * TILE_SIZE)}
                    pieceType={spot[2][1]}
                    pieceColor={spot[2][0]}
                    mouseX={x}
                    mouseY={y}
                    tileSize={TILE_SIZE}
                    boardCoords={BOARD_COORDS}
                    validMove={validMove} 
                    gameStateArray={gameStateArray}
                    clearPossibleMoves={clearPossibleMoves}
                    savePossibleMoves={savePossibleMoves} 
                    changeTurn={changeTurn}
                    turn={turn}
                    castleStatus={castleStatus}
                    setCastleStatus={setCastleStatus} />
        )
    })

    // Initialize the spots array
    const spots = gameArray.map((row, r) => {
        return (
            row.map((col, c) => {
                return (
                    <Spot
                        key={r+c}
                        startX={BOARD_COORDS[0] + (c * TILE_SIZE)}
                        startY={BOARD_COORDS[1] + (r * TILE_SIZE)} 
                        tileSize={TILE_SIZE} 
                        spotColor={(r + c) % 2 ? "grey" : "lightblue"}
                        possibleMoves={possibleMoves}
                        col={c}
                        row={r}
                        causesJump={causesJump} 
                        gameStateArray={gameStateArray} />
                )
            })
        )
    })

    const styles = {
        width: TILE_SIZE * 8,
        height: TILE_SIZE * 8,
        top: BOARD_COORDS[1],
        left: BOARD_COORDS[0],
    }

    return (
        <div className="chessBoard" style={styles}>
            {pieces}
            {spots}
            <p style={{position: "absolute", top: "103%"}}>{turn === "w" ? "White's turn" : "Black's turn"}</p>
            <button className="resetButton" onClick={resetGame}>New game</button>
        </div>
    )
}

export default Board