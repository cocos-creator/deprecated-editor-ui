(function () {
    Polymer(EditorUI.mixin({
        publish: {
            name: '',
            folded: {
                value: false,
                reflect: true
            },
        },

        created: function () {
        },

        ready: function() {
            this._init(this.$.title);
        },

        clickAction: function (event) {
            this.folded = !this.folded;
            event.stopPropagation();
        },
    }, EditorUI.focusable));
})();
