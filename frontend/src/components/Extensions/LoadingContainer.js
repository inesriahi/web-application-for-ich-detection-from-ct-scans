import React from 'react'

const LoadingContainer = (props) => {
    return (
        <div className="loading-container">
            {props.children}
            <h3 style={{marginTop: "20px"}}>{props.text}</h3>
        </div>
    )
}

export default LoadingContainer
