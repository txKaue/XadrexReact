import React, { useState, useEffect } from "react"

function Spot(props) {
    const [showHighlight, setShowHighlight] = useState(false)

    let styles = {
        width: props.tileSize,
        height: props.tileSize,
        backgroundColor: props.spotColor,
        userSelect: "none",
        zIndex: 1,
        position: "fixed",
        top: props.startY,
        left: props.startX,
    }

    useEffect(() => {
        if (props.possibleMoves.length === 0) {
            setShowHighlight(false);
        } else {
            for (let i = 0, l = props.possibleMoves.length; i < l; i++) {
                if (props.possibleMoves[i][0] === props.col && props.possibleMoves[i][1] === props.row) {
                    setShowHighlight(true)
                    break
                }
            }
        }
    }, [props.possibleMoves])

    return(
        <div style={styles}>
            <div style={{backgroundColor: "#0000004f", 
                borderRadius: "50%", 
                display: showHighlight ? "block" : "none", 
                width: "100%", 
                height: "100%"}}>
            </div>
        </div>
    )
}

export default Spot