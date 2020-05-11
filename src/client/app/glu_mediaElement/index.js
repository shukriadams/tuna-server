import React from 'react';
import ClassNames from 'classnames';
import { View as GluPicture, Model as PictureModel } from './../glu_picture/index';
import { View as GluVideo, Model as VideoModel } from './../glu_video/index';
import { View as GluTextIntro, Model as TextIntroModel } from './../glu_textIntro/index';

class View extends React.Component {

    render(){
        let modifiers = {};
        modifiers[`glu_mediaElement--forceWindowHeight`] =  this.props.forceWindowHeight === true;

        return (
            <div className={ClassNames(`glu_mediaElement`, modifiers )}>

                {
                    this.props.video &&
                        <div className={`glu_mediaElement-media`}>
                            <GluVideo {...this.props.video} />
                        </div>
                }

                {
                    // image is not shown if video model set
                    this.props.image && !this.props.video &&
                        <div className={`glu_mediaElement-media`}>
                            <GluPicture {...this.props.image} />
                        </div>
                }

                {
                    this.props.text &&
                        <div className={`glu_mediaElement-text`}>
                            <GluTextIntro {...this.props.text} />
                        </div>
                }

            </div>
        );
    }
}

let Model = {
    forceWindowHeight: false,
    video : VideoModel,
    image : PictureModel,
    text : TextIntroModel
};

View.defaultProps = Model;

export { View, Model };
