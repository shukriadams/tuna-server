import React from 'react';

class View extends React.Component {

    constructor(props) {
        super(props);
    }

    render(){
        let img = null;

        for (let source of this.props.sources)
            if (source.default) {
                img = (<img className={`glu_picture-image`} srcSet={source.srcset} />);
            }

        return (
            <picture className={`glu_picture`}>
            {
                this.props.sources.map(function(source, index){
                    return (
                        <source srcSet={source.srcset} media={`(min-width: ${source.minWidth}px)`} key={index} />
                    )
                })
            }

            {
                img
            }
        </picture>
        );
    }
}
let Model = {
    sources : [
        {
            srcset : "http://placehold.it/600x300",
            minWidth : 0,
            default : true
        }
    ]
};

View.defaultProps = Model;

export { View, Model };