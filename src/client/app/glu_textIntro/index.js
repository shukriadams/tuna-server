import React from 'react';

class View extends React.Component {

    render(){

        if (this.props.titleWeight < 1 || this.props.titleWeight > 6)
            throw new Error(`Invalid title weight for glu_textIntro : ${this.props.titleWeight}, must be 1-6`);

        const // assign numeric weight to header tag
            HeaderTag = `h${this.props.titleWeight}`;

        return (
            <div className={`glu_textIntro`}>

                {/* apply grid behaviour to this element with mixins */}
                <div className={`glu_textIntro-gridScaffold`}>

                    {
                        this.props.title &&
                            <HeaderTag className={`glu_textIntro-header`} dangerouslySetInnerHTML={{__html: this.props.title}} />
                    }

                    {
                        this.props.text &&
                            <p className={`glu_textIntro-text`} dangerouslySetInnerHTML={{__html: this.props.text}} />
                    }

                </div>
            </div>
        );
    }
}

let Model = {
    titleWeight: 2,
    title : 'Your title here',
    text : 'Your text here'
};

View.defaultProps = Model;

export { View, Model };