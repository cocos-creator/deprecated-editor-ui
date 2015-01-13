Polymer(EditorUI.mixin({
    publish: {
        value: false,
    },

    ready: function () {
        this._initFocusable( this.$.focus );
    },

    clickAction: function (event) {
        event.stopPropagation();

        this.value = !this.value;
        if ( !this.focused )
            this.$.focus.focus();

        this.fire('changed');
    },

}, EditorUI.focusable));
