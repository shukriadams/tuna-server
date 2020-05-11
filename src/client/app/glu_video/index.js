import React from 'react';

class View extends React.Component {

    render(){
        return (
            <video className={`glu_video`} controls={this.props.controls} muted={this.props.muted} autoPlay={this.props.autoplay} loop={this.props.loop} poster={this.props.poster}>
                {
                    this.props.sources.map(function(source, index){
                        return (
                            <source key={index} src={source.src} type={`video/${source.type}`} />
                        );
                    })
                }
            </video>
        );
    }
}

let Model = {
    controls : false,
    autoplay : true,
    loop : true,
    muted : true,

    // sources should cover different video formats, egs, mp4 + ogg
    sources : [
        {
            src : 'https://s3.amazonaws.com/shukriadams-webmedia-public/black+loop.mp4',
            type : 'mp4'
        }
    ],

    // optional poster image url
    poster : null
};

View.defaultProps = Model;

export { View, Model };