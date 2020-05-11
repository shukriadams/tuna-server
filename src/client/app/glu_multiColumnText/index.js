import React from 'react';
import { View as GluTextIntro, Model as HeaderModel } from './../glu_textIntro/index'

class View extends React.Component {

    constructor(props) {
        super(props);
    }

    render(){
        return (
            <div className={`glu_multiColumnText`}>
                <div className={`glu_multiColumnText-gridScaffold`}>
                    { this.props.header &&
                        <GluTextIntro {...this.props.header} />
                    }

                    <div className={`glu_multiColumnText-columns--${this.props.columns}`} dangerouslySetInnerHTML={{__html:this.props.text}} />
                </div>
            </div>
        );
    }
}

let Model = {
    header : HeaderModel,
    columns : 3,
    text : 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?'
};

View.defaultProps = Model;

export { View, Model };