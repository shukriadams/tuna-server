import React from 'react';
import { View as Button, Model as buttonModel } from './../glu_button/index';

class View extends React.Component {

    render(){

        return (
            <div className={`glu_simpleCookieBanner`}>

                <div className={`glu_simpleCookieBanner-gridScaffold`}>
                    <div className={`glu_simpleCookieBanner-content`}>
                        {this.props.children}
                    </div>
                    <Button {...this.props.buttonModel} />
                </div>

            </div>
        );
    }
}

let Model = {
    buttonModel : buttonModel
};

View.defaultProps = Model;

export { View, Model };
