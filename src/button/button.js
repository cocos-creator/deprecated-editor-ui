(function () {
    Polymer(EditorUI.mixin({
        ready: function () {
            this._init( this.$.focus );
        },
    }, EditorUI.focusable));
})();
