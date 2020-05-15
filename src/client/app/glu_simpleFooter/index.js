import React from 'react';
import ReactSVG from 'react-svg';
import { Link } from 'react-router-dom'

class View extends React.Component {

    constructor(props) {
        super(props);
    }

    render(){

        return (
            <div className={`glu_simpleFooter`}>
                {/* apply grid behaviour to this element with mixins */}
                <div className={`glu_simpleFooter-gridScaffold`}>
                    <div className={`glu_simpleFooter-primary`}>
                        {
                            // there should be a maximum of 4 sections
                            this.props.sections.map(function(section, index){
                                return (
                                    <div className={`glu_simpleFooter-section`} key={index}>

                                        <h2 className={`glu_simpleFooter-sectionTitle`}>{section.title}</h2>

                                        {
                                            section.subTitle &&
                                                <p className={`glu_simpleFooter-text`}>{section.subTitle}</p>
                                        }

                                        <ul className={`glu_simpleFooter-links`}>
                                            {
                                                section.links.map(function(link, index){
                                                    return (
                                                        <li className={`glu_simpleFooter-link`} key={index}>
                                                            {
                                                                link.isRoute &&
                                                                <Link className={`glu_simpleFooter-anchor`} to={link.href} title={link.text}>
                                                                    {
                                                                        link.iconSVG &&
                                                                            <ReactSVG path={this.props.iconSVG} />
                                                                    }
                                                                    {link.text}
                                                                </Link>
                                                            }

                                                            {
                                                                !link.isRoute &&
                                                                <a className={`glu_simpleFooter-anchor`} href={link.href} title={link.text}>
                                                                    {
                                                                        link.iconSVG &&
                                                                            <ReactSVG path={this.props.iconSVG} />
                                                                    }
                                                                    {link.text}
                                                                </a>
                                                            }
                                                        </li>
                                                    );
                                                })
                                            }
                                        </ul>
                                    </div>
                                )
                            })
                        }
                    </div>

                    <div dangerouslySetInnerHTML={{__html: this.props.secondaryText}} className={`glu_simpleFooter-secondary`} />
                    
                </div>
            </div>
        );
    }
}
let link = {
    href : 'example.com',
    text : 'Thing',
    iconSVG : null
};
let section = {
    title : 'Your title here',
    subTitle : 'Your subtitle here',
    links : [link, link, link, link]
};

let Model = {
    sections : [section, section, section, section],
    secondaryText : 'Copyright 2016. Powered by coffee.'
};

View.defaultProps = Model;

export { View, Model };