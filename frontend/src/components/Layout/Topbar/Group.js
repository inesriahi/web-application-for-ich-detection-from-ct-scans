import React from 'react'

const Group = (props) => {
    
    return (
        <div className={`sub-section ${props.additionalClass}`}>
            <h6 className="tip">{props.title}</h6>
            <div className="content">
              {props.children}
            </div>
          </div>
    )
}

Group.defaultProps = {"additionalClass":"", "title": ""}

export default Group
