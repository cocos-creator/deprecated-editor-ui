(function () {
    Polymer(EditorUI.mixin({
        publish: {
            value: null,
        },

        observe: {
            disabled: 'disabledChanged',
        },

        created: function () {
            this.value = new Fire.Vec2(0,0);
        },

        ready: function() {
            this._init();
        },

        disabledChanged: function () {
            this._disabledChanged();
            this.$.x.disabled = this.disabled;
            this.$.y.disabled = this.disabled;
        },

        changedAction: function ( event ) {
            this.value = new Fire.Vec2(this.$.x.value, this.$.y.value);
            event.stopPropagation();
            this.fire("changed");
        },
    }, EditorUI.focusable));
})();
