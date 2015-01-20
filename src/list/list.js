Polymer(EditorUI.mixin({
    publish: {
        value: null,
        icon: {
            reflect: true,
            value: false,
        }
    },

    ready: function () {
        this._initFocusable(this.$.content);

        this._curSelection = null;
    },

    select: function ( item ) {
        if ( this.value ) {
            for ( var i = 0; i < this.value.length; ++i ) {
                this.value[i].selected = false;
            }
        }

        if ( item ) {
            item.selected = true;
            this.fire('selected', item);
        }
    },

    selectAction: function ( event ) {
        if ( event.which !== 1 )
            return;

        if ( this._curSelection === event.target )
            return;

        this.select(event.target.value);
    },

}, EditorUI.focusable));
