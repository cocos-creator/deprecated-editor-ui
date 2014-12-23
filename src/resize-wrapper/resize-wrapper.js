(function () {
    Polymer(EditorUI.mixin({
        publish: {
            'width': 100,
            'height': 100,
            'min-width': 100,
            'min-height': 100,
        },

        ready: function () {
            this._initResizable();
        },
    }, EditorUI.resizable));
})();
