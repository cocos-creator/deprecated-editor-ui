(function () {
    Polymer(EditorUI.mixin({
        publish: {
            value: false,
        },

        ready: function () {
            this._init( this.$.focus );
        },

        clickAction: function (event) {
            this.value = !this.value;
            event.stopPropagation();

            this.fire('changed');
        },

    }, EditorUI.focusable));
})();
