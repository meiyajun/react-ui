import React from 'react';
import Constants from './Constants';
import {getTMPDOMRoot} from './Utils';


let Popup = React.createClass({
    statics: {
        show: function (args) {
            var $root = getTMPDOMRoot(args.modal, args.maskClassName);
            var popup = (
                <Popup {...args}>
                    {args.content}
                </Popup>
            );
            return React.render(popup, $root);
        }
    },

    getDefaultProps() {
        return {
            closable: true,
            animated: true,
            buttons: ['OK', 'Cancel']
        };
    },

    getInitialState() {
        return {
            hide: false,
            title: this.props.title
        };
    },

    renderButtons() {
        var footer = null;

        if (this.props.buttons && this.props.buttons.length) {
            let buttons = this.props.buttons.map((label, i)=> {
                return <button key={i} data-idx={i} onClick={this.onBtnClick}>{label}</button>;
            });
            footer = <div className="Footer">{buttons}</div>
        }

        return footer;
    },

    onBtnClick(evt) {
        var idx = parseInt(evt.target.dataset.idx);
        if (typeof this.props.onBtnClick == 'function') {
            var ret = this.props.onBtnClick(idx, this.refs.content);
            if (ret) {
                this.close();
            }
        }
    },

    show() {
        var parentNode = this.getDOMNode().parentNode;
        parentNode.style.display = 'block';
    },
    
    hide() {
        var parentNode = this.getDOMNode().parentNode;
        parentNode.style.display = 'none';
    },

    close() {
        var {popupClosing} = this.props;
        if (typeof popupClosing == 'function') {
            if (popupClosing.call(this)) return;
        }
        if (this.props.animated) {
            this.setState({
                hide: true
            });
            setTimeout(()=> {
                this.destroy();
            }, Constants.config.transitionDuration);
        } else {
            this.destroy();
        }
    },

    destroy() {
        if (typeof this.props.popupWillClose == 'function') {
            this.props.popupWillClose();
        }
        var $root = this.getDOMNode().parentNode;
        React.unmountComponentAtNode($root);
        $root.parentNode.removeChild($root);
    },

    setTitle(title) {
        this.setState({
            title: title
        });
    },

    render() {
        var className = 'Popup',
            props = this.props,
            state = this.state;
        if (props.className) {
            className += ' ' + props.className;
        }
        if (props.animated) {
            className += state.hide ? ' Hide' : ' Show';
        }

        var footer = this.renderButtons();
        var content = React.addons.cloneWithProps(props.children, {
            ref: 'content',
            parent: this
        });

        if (this.props.closable) {
            var closeBtn = <a className="Close" onClick={this.close} href="javascript:;">&times;</a>;
        }

        return (
            <div id={props.id} className={className}>
                <div className="Title">
                    <h1>{state.title}</h1>
                    {closeBtn}
                </div>
                <div className="Content">{content}</div>
                {footer}
            </div>
        );
    }
});

export default Popup;
