Polymer(EditorUI.mixin({
    publish: {
        'min-width': 100,
        'min-height': 100,
    },

    ready: function () {
        this._initResizable();
    },
}, EditorUI.resizable));
