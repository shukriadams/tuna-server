import React from 'react'
import classNames from 'classnames'
import ReactSVG from 'react-svg'
import noScroll from './../glu_noScroll/index'
import { HashLink as Link } from 'react-router-hash-link'

class View extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isOpen : false
        }
    }

    toggleMenu(){
        this.setState({ isOpen : !this.state.isOpen })
    }

    onSearchChange(){
        if (this.props.search.onChange)
            this.props.search.onChange(this.refs.search.value)
    }

    render(){
        const menuSVG = this.state.isOpen ? this.props.closeSVG : this.props.menuSVG

        if (this.state.isOpen)
            noScroll.lock()
        else
            noScroll.unlock()

        let moduleClassNames = {}
        moduleClassNames[`glu_simpleHeader--dockTop`] = this.props.isDockedToWindowTop
        moduleClassNames[`glu_simpleHeader--open`] = this.state.isOpen

        return (
            <div className={classNames(`glu_simpleHeader`, moduleClassNames )}>

                {/* apply grid behaviour to this element with mixins */}
                <div className={`glu_simpleHeader-gridScaffold`}>

                    {/* preload close icon, it cannot be dynamically loaded after init */}
                    <div style={{display:'none'}}>
                        <ReactSVG path={this.props.closeSVG} />
                    </div>

                    <div className={`glu_simpleHeader-logoTitleWrapper`}>
                        <i>
                            { this.props.logoSVG &&
                                <ReactSVG path={this.props.logoSVG} className={`glu_simpleHeader-logo`} />
                            }
                        </i>
                        <Link className={`glu_simpleHeader-title`} to="/">{this.props.title}</Link>
                    </div>

                    {
                        this.props.search.enabled &&
                            <div className={`glu_simpleHeader-searchWrapper`}>
                                <input ref="search" autoComplete={this.props.search.autocomplete ? '': 'nope'} onChange={this.onSearchChange.bind(this)} className={`glu_simpleHeader-search`} placeholder={this.props.search.placeholder} type="text" />
                            </div>
                    }

                    <ul className={`glu_simpleHeader-menu`}>
                        {
                            this.props.menuItems.map(function(item, index){
                                
                                const itemClasses={}
                                if (item.showOnScreenSize)
                                    itemClasses[`glu_simpleHeader-menuItem--showOn${item.showOnScreenSize}`] = true

                                const linkClasses = {}
                                linkClasses[`glu_simpleHeader-menuItemLink--active`] = item.isActive
                                linkClasses[`glu_button`] = item.isCTA

                                return (
                                    <li key={index} className={classNames(`glu_simpleHeader-menuItem`, itemClasses)}>
                                        {
                                            item.isRoute &&
                                            <Link className={classNames(`glu_simpleHeader-menuItemLink`, linkClasses )} to={item.href}>{item.title}</Link>
                                        }

                                        {
                                            !item.isRoute &&
                                            <a className={classNames(`glu_simpleHeader-menuItemLink`, linkClasses )} onClick={item.onClick}  href={item.href}>
                                                {item.title}
                                            </a>
                                        }

                                    </li>)
                            })
                        }
                    </ul>

                    <i onClick={this.toggleMenu.bind(this)}>
                        <ReactSVG path={menuSVG} className={`glu_simpleHeader-menuToggle`} />
                    </i>

                </div>
            </div>
        )
    }
}

let Model = {
    // absolute path to svg for menu burger icon
    menuSVG : null,

    // absolute path to svg for site logo
    logoSVG : null,

    // absolute path to svg for close icon
    closeSVG : null,

    // if true, menu will stick to top of viewport in"
    isDockedToWindowTop : false,

    // display name of site in menu bar
    title : "site-title",

    // menu items - see glu_simpleHeader-menuItem.json
    menuItems : [ ],

    search : {
        enabled : false,
        // optional placeholder text for search field
        placeholder : null,
        // callback to handle search change
        onChange : null,
        autocomplete : false
    }
}

let ItemModel = {
    
    // string, use to modify listitem class for limiting to screen size
    showOnScreenSize : null,

    // url of menu item target page
    href : 'page-url',

    // if true, will be react route
    isRoute : false,

    // set to true if link should render as button
    isCTA : false,

    // set to true if link should be in active state
    isActive : false,

    // display text in menu item
    title : 'page-name'
}

let ctaMenuItem = Object.assign({}, ItemModel)
ctaMenuItem.isCTA = true

let activeItem = Object.assign({}, ItemModel)
activeItem.isActive = true

Model.menuItems = [ ItemModel, activeItem, ctaMenuItem ]

View.defaultProps = Model

export { View, Model, ItemModel }
