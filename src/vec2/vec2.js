Polymer(EditorUI.mixin({
    publish: {
        value: null,
    },

    observe: {
        focused: 'focusedChanged',
        disabled: 'disabledChanged',
    },

    created: function () {
        this.value = new Fire.Vec2(0,0);
    },

    ready: function() {
        this._initFocusable();
    },

    initTabIndex: function () {
        this.$.x.initTabIndex();
        this.$.y.initTabIndex();
    },

    removeTabIndex: function () {
        this.$.x.removeTabIndex();
        this.$.y.removeTabIndex();
    },

    focusedChanged: function () {
        this._focusedChanged();
        if ( this.focused ) {
            this.$.x.focus();
        }
    },

    disabledChanged: function () {
        this._disabledChanged();
        this.$.x.disabled = this.disabled;
        this.$.y.disabled = this.disabled;
    },

    changedAction: function ( event ) {
        this.value = new Fire.Vec2(this.$.x.value, this.$.y.value);
        event.stopPropagation();
        EditorUI.fireChanged(this);
    },
}, EditorUI.focusable));
