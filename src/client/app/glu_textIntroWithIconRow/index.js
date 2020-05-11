import React from 'react';
import { View as TextIntroView, Model as TextIntroModel } from './../glu_textIntro/index';
import ReactSVG from 'react-svg';

class View extends React.Component {

    render(){
        const HeaderTag = `h${this.props.headerWeight}`; // assign numeric weight to header tag

        return (
            <div className={`glu_textIntroWithIconRow`}>
                <div className={`glu_textIntroWithIconRow-gridScaffold`}>
                    <HeaderTag className={`glu_textIntroWithIconRow-header`}>{this.props.header}</HeaderTag>
                    <div className={`glu_textIntroWithIconRow-items`}>
                        {
                            this.props.items.map(function(item, index){
                                return(
                                    <div className={`glu_textIntroWithIconRow-item`} key={index}>

                                        {
                                            item.iconSVG &&
                                                <ReactSVG path={item.iconSVG} />
                                        }

                                        <TextIntroView {...item.text} />
                                    </div>
                                )
                            })
                        }

                    </div>
                </div>
            </div>
        );
    }
}

TextIntroModel.titleWeight = 3;

let Item = {
    iconSVG : '/media/svg/glu_allmodules_placeholdersvg.svg',
    text : TextIntroModel
};

let Model = {
    headerWeight : 2,
    header : 'Your title here',
    items : [ Item, Item, Item]
};

View.defaultProps = Model;

export { View };