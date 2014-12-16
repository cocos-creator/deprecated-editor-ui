(function () {
    Polymer(EditorUI.mixin({
        ready: function () {
            this._initFocusable();
        },
    }, EditorUI.focusable));
})();
