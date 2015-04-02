Polymer({
    ready: function () {
        this._initFocusable(this.$.content);
        this._initResizable();

        //
        var tabs = this.$.tabs;
        tabs.panel = this;

        // reset the min width & height, so that view elements' min width & height can be overwrite on it.
        this['min-width'] = -1;
        this['min-height'] = -1;

        //
        for ( var i = 0; i < this.children.length; ++i ) {
            var el = this.children[i];

            //
            this._applyViewSize(el, i === 0);

            //
            var name = el.getAttribute('name');
            var tabEL = tabs.add(name);
            tabEL.setAttribute('draggable', 'true');

            el.style.display = 'none';
            tabEL.viewEL = el;

            tabEL.setIcon( el.icon ); // TEMP HACK
        }

        // go back to default settings if no view elements apply its min width and height.
        if ( this['min-width'] === -1 ) this['min-width'] = 200;
        if ( this['min-height'] === -1 ) this['min-height'] = 200;

        // re-init the size of the panel
        this.initSize();

        //
        tabs.select(0);
    },

    _finalizeSize: function () {
    },

    _reflow: function () {
    },

    _applyViewSize: function ( viewEL, applyWidthHeight ) {
        // confirm the min, max size of the panel by its children views
        var minWidth = parseInt(viewEL.getAttribute('min-width'));
        if ( minWidth && minWidth > this['min-width'] ) {
            this['min-width'] = minWidth;
        }
        var minHeight = parseInt(viewEL.getAttribute('min-height'));
        if ( minHeight && minHeight > this['min-height'] ) {
            this['min-height'] = minHeight;
        }
        // DISABLE: no need
        // var maxWidth = parseInt(viewEL.getAttribute('max-width'));
        // if ( maxWidth && maxWidth > this['max-width'] ) {
        //     this['max-width'] = maxWidth;
        // }
        // var maxHeight = parseInt(viewEL.getAttribute('max-height'));
        // if ( maxHeight && maxHeight > this['max-height'] ) {
        //     this['max-height'] = maxHeight;
        // }

        // use first child's width, height for the panel
        if ( applyWidthHeight ) {
            var width = parseInt(viewEL.getAttribute('width'));
            if ( width ) {
                this.width = width;
            }
            var height = parseInt(viewEL.getAttribute('height'));
            if ( height ) {
                this.height = height;
            }
        }
    },

    get activeTab () {
        return this.$.tabs.activeTab;
    },

    get tabCount () {
        return this.$.tabs.children.length;
    },

    select: function ( tab ) {
        var tabs = this.$.tabs;
        tabs.select(tab);
    },

    insert: function ( tabEL, viewEL, insertBeforeTabEL ) {
        var tabs = this.$.tabs;

        var name = viewEL.getAttribute('name');
        tabs.insert(tabEL, insertBeforeTabEL);
        tabEL.setAttribute('draggable', 'true');

        // NOTE: if we just move tabs, we must not hide viewEL
        if ( tabEL.parentElement !== tabs ) {
            viewEL.style.display = 'none';
        }
        tabEL.viewEL = viewEL;

        tabEL.setIcon( viewEL.icon ); // TEMP HACK

        // a new panel
        if ( this.children.length === 1 ) {
            this['min-width'] = -1;
            this['min-height'] = -1;
        }

        // apply
        this.appendChild(viewEL);

        // go back to default settings if no view elements apply its min width and height.
        if ( this.children.length === 1 ) {
            if ( this['min-width'] === -1 ) {
                var minWidth = parseInt(this.getAttribute('min-width'));
                this['min-width'] = minWidth >= 0 ? minWidth : 200;
            }

            if ( this['min-height'] === -1 ) {
                var minHeight = parseInt(this.getAttribute('min-height'));
                this['min-height'] = minHeight >= 0 ? minHeight : 200;
            }
        }

        this._applyViewSize( viewEL, this.children.length === 1 );
        this.initSize();
        return EditorUI.index(tabEL);
    },

    add: function ( viewEL ) {
        var tabs = this.$.tabs;

        var name = viewEL.getAttribute('name');
        var tabEL = tabs.add(name);
        tabEL.setAttribute('draggable', 'true');

        viewEL.style.display = 'none';
        tabEL.viewEL = viewEL;

        tabEL.setIcon( viewEL.icon ); // TEMP HACK

        this.appendChild(viewEL);

        // a new panel
        if ( this.children.length === 1 ) {
            this['min-width'] = -1;
            this['min-height'] = -1;
        }

        // apply
        this._applyViewSize( viewEL, this.children.length === 1 );

        // go back to default settings if no view elements apply its min width and height.
        if ( this.children.length === 1 ) {
            if ( this['min-width'] === -1 ) {
                var minWidth = parseInt(this.getAttribute('min-width'));
                this['min-width'] = minWidth >= 0 ? minWidth : 200;
            }

            if ( this['min-height'] === -1 ) {
                var minHeight = parseInt(this.getAttribute('min-height'));
                this['min-height'] = minHeight >= 0 ? minHeight : 200;
            }
        }

        this.initSize();
        return this.children.length - 1;
    },

    closeNoCollapse: function ( tabEL ) {
        var tabs = this.$.tabs;

        //
        tabs.remove(tabEL);
        if ( tabEL.viewEL ) {
            tabEL.viewEL.remove();
            tabEL.viewEL = null;
        }

        // reset the min width & height, so that view elements' min width & height can be overwrite on it.
        this['min-width'] = -1;
        this['min-height'] = -1;

        // apply
        for ( var i = 0; i < this.children.length; ++i ) {
            var el = this.children[i];
            this._applyViewSize(el, false);
        }

        // go back to default settings if no view elements apply its min width and height.
        if ( this['min-width'] === -1 ) {
            var minWidth = parseInt(this.getAttribute('min-width'));
            this['min-width'] = minWidth >= 0 ? minWidth : 200;
        }

        if ( this['min-height'] === -1 ) {
            var minHeight = parseInt(this.getAttribute('min-height'));
            this['min-height'] = minHeight >= 0 ? minHeight : 200;
        }

        this.initSize();
    },

    close: function ( tabEL ) {
        this.closeNoCollapse(tabEL);
        this.collapse();
    },

    collapse: function () {
        // remove from dock;
        if ( this.$.tabs.children.length === 0 ) {
            if ( this.parentElement instanceof FireDock ) {
                this.parentElement.removeDock(this);
            }
        }
    },

    tabsChangedAction: function ( event ) {
        var detail = event.detail;
        if ( detail.old !== null ) {
            detail.old.viewEL.style.display = 'none';
            detail.old.viewEL.dispatchEvent( new CustomEvent('hide') );
        }
        if ( detail.new !== null ) {
            detail.new.viewEL.style.display = '';
            detail.new.viewEL.dispatchEvent( new CustomEvent('show') );
        }

        event.stopPropagation();
    },
});
