/***********************************************************************************************************************
 * The usual startup "feature vs price" matrix, price should be in head, feature name as first column, feature info as
 * remainder of table.
 *
 * On desktop you see the full table, on mobile it collapses into a tab control, where clicking on a header shows the
 * column associated with that header.
 *
 **********************************************************************************************************************/
import React from 'react';
import Classnames from 'classnames';
import { View as GluTextIntro, Model as TextIntroModel } from './../glu_textIntro/index';
import { Link } from 'react-router-dom'


/***********************************************************************************************************************
 * View
 **********************************************************************************************************************/
class View extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeIndex : 0
        };
    }

    headerClick (index){
        this.setState({ activeIndex : index})
    }

    render(){

        return (
            <div className={`glu_featurePriceMatrix`}>
                <div className={`glu_featurePriceMatrix-gridScaffold`}>

                    {
                        this.props.title &&
                        <div className={`glu_featurePriceMatrix-header`}>
                            <GluTextIntro {...this.props.title} />
                        </div>
                    }

                    <div className={`glu_featurePriceMatrix-tableWrap`}>

                        {/* HEADER of matrix*/}
                        <div className={`glu_featurePriceMatrix-head`}>
                            {/* blank cell in left corner of header */}
                            <div className={`glu_featurePriceMatrix-headEmptyCell`}></div>

                            {
                                this.props.header.map(function(item, index){
                                    let activeClasses = {};
                                    activeClasses[`glu_featurePriceMatrix-headItem--active`] = index === this.state.activeIndex;

                                    return (
                                        <div className={Classnames(`glu_featurePriceMatrix-headItem`, activeClasses)} onClick={this.headerClick.bind(this, index)} key={index}>
                                            <div className={`glu_featurePriceMatrix-headItemInner`}>
                                                {item.text}
                                            </div>
                                        </div>
                                    );
                                }.bind(this))
                            }
                        </div>


                        {
                            /* FEATURE ROWS of matrix */
                            this.props.rows.map(function(row, index){
                                return (
                                    <div className={`glu_featurePriceMatrix-row`} key={index}>
                                        <div className={`glu_featurePriceMatrix-rowLead`} key={-1}>
                                            {row.text}
                                        </div>
                                        {
                                            row.cells.map(function(cell, index){
                                                let activeClasses = {};
                                                activeClasses[`glu_featurePriceMatrix-cell--active`] = index === this.state.activeIndex;

                                                return (
                                                    <div className={Classnames(`glu_featurePriceMatrix-cell`, activeClasses)} key={index}>
                                                        <div className={`glu_featurePriceMatrix-cellInner`}>
                                                            {cell.text}
                                                        </div>
                                                    </div>
                                                );
                                            }.bind(this))
                                        }
                                    </div>
                                );
                            }.bind(this))
                        }


                        {/*  CTA row  */}
                        <div className={`glu_featurePriceMatrix-ctas`}>
                            <div className={`glu_featurePriceMatrix-ctaEmptyCell`}></div>
                            {
                                this.props.ctas.map(function(item, index){
                                    let activeClasses = {};
                                    activeClasses[`glu_featurePriceMatrix-cta--active`] = index === this.state.activeIndex;

                                    return (
                                        <div className={Classnames(`glu_featurePriceMatrix-cta`, activeClasses)} key={index}>
                                            <div className={`glu_featurePriceMatrix-ctaInner`}>
                                                <Link className={`glu_button`} to={item.url} title={item.text}>
                                                    {item.text}
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                }.bind(this))
                            }
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

/***********************************************************************************************************************
 * Model
 **********************************************************************************************************************/
let CellModel = {
    // text to display in cell
    text : 'available 1',

    // optional svg icon
    iconSVG : null
};
let cell2 = Object.assign({}, CellModel);
cell2.text = 'available 2';

let CtaModel = {
    url : 'www.example.com',
    text : 'Join'
};

let RowModel = {
    text : 'feature x',
    cells : [ CellModel, cell2 ]
};

let Model = {
    title : TextIntroModel,
    header : [ RowModel, RowModel ],
    rows : [ RowModel, RowModel ],
    ctas: [CtaModel, CtaModel]
};

View.defaultProps = Model;

export { View, Model, CellModel, RowModel, CtaModel };
