Polymer(EditorUI.mixin({
    publish: {
        value: null,
    },

    observe: {
        'value': 'rebuild',
    },

    created: function () {
        this.selection = [];
        this.editing = false;
    },

    ready: function () {
        this._initFocusable(this.$.focus);
    },

    domReady: function () {
        if ( this.value === null ) {
            this.value = [];
        }

        this.rebuild();
    },

    rebuild: function () {
        if ( this.editing ) {
            this.editing = false;
            return;
        }

        var listRoot = this.$.list;
        while (listRoot.firstChild) {
            listRoot.removeChild(listRoot.firstChild);
        }

        //
        if ( Array.isArray (this.value) ) {
            var changedAction = function ( event ) {
                this.editing = true;
                var item = event.target;
                this.value[item.index] = item.value;
            }.bind(this);

            for ( var i = 0; i < this.value.length; ++i ) {
                var item = this.value[i];
                var liEL = new FireListItem();
                liEL.value = item;
                liEL.index = i;
                liEL.addEventListener("changed", changedAction);
                listRoot.appendChild(liEL);
            }
        }
        else {
            Fire.warn("The value is not an array.");
        }
    },

    focusinAction: function (event) {
        this._focusAction();
    },

    focusoutAction: function (event) {
        if ( this.focused === false )
            return;

        if ( EditorUI.find( this.shadowRoot, event.relatedTarget ) )
            return;

        this.clearSelect();
        this._blurAction();
    },

    deleteAction: function (event, detail, sender) {
        Fire.log("deleteAction");
        event.stopPropagation();
    },

    clickAction: function (event) {
        if ( event.target instanceof FireListItem ) {
            if ( event.metaKey || event.ctrlKey ) {
                this.toggle( [event.target] );
            }
            else {
                this.clearSelect();
                this.select( [event.target] );
            }
        }
        event.stopPropagation();
    },

    toggle: function ( items ) {
        for ( var i = 0; i < items.length; ++i ) {
            var item = items[i];
            if ( item.selected === false ) {
                item.select();
                this.selection.push(item);
            }
            else {
                item.unselect();

                var idx = this.selection.indexOf(item);
                this.selection.splice(idx,1);
            }
        }
    },

    select: function ( items ) {
        for ( var i = 0; i < items.length; ++i ) {
            var item = items[i];
            if ( item.selected === false ) {
                item.select();
                this.selection.push(item);
            }
        }
    },

    unselect: function ( items ) {
        for ( var i = 0; i < items.length; ++i ) {
            var item = items[i];
            if ( item.selected ) {
                item.unselect();

                var idx = this.selection.indexOf(item);
                this.selection.splice(idx,1);
            }
        }
    },

    clearSelect: function () {
        for ( var i = 0; i < this.selection.length; ++i ) {
            this.selection[i].unselect();
        }
        this.selection = [];
    },
}, EditorUI.focusable));
