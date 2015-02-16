Polymer(EditorUI.mixin({
    publish: {
        name: '',
        folded: {
            value: false,
            reflect: true
        },
        closable: {
            value: false,
            reflect: true
        }
    },

    created: function () {
    },

    ready: function() {
        this._initFocusable(this.$.title);
    },

    clickAction: function (event) {
        event.stopPropagation();

        this.folded = !this.folded;
    },

    closeAction: function (event) {
        event.stopPropagation();

        this.fire('close');
    },
}, EditorUI.focusable));
