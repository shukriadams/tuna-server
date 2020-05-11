import { View as GluModal } from './../glu_modal/index'
import React from 'react'

class View extends React.Component {
    render(){
        
        let header = (
            <h2 className="modal-title">{this.props.title}</h2>
        )

        return (
            <div className="modal">
                <GluModal {...this.props} header={header}>
                    <div className="modal-content">
                        {this.props.children}
                    </div>
                </GluModal>
            </div>
        )

    }
}

View.defaultProps = {
    title : 'myTitle'
}

export default View