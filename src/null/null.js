Polymer(EditorUI.mixin({
    publish: {
        value: null,
        type: null,
        ctor: null,
    },

    ready: function () {
        this._initFocusable();
    },

    createAction: function () {
        if ( this.ctor ) {
            this.value = new this.ctor();
            EditorUI.fireChanged(this);
            this.fire('null-changed');
        }
    },

}, EditorUI.focusable));
