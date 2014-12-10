(function () {
    Polymer(EditorUI.mixin({
        ready: function () {
            this._initFocusable( this.$.focus );
        },
    }, EditorUI.focusable));
})();
