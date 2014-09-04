(function () {
    Polymer({
        publish: {
            value: false,
            focused: {
                value: false,
                reflect: true
            },
        },

        ready: function () {
            this.$.focus.tabIndex = EditorUI.getParentTabIndex(this)+1;
        },

        focusAction: function (event) {
            this.focused = true;
        },

        blurAction: function (event) {
            if ( this.focused === false )
                return;

            if ( EditorUI.find( this.shadowRoot, event.relatedTarget ) )
                return;

            this.focused = false;
        },

        clickAction: function (event) {
            this.value = !this.value;
            this.fire('changed');
            event.stopPropagation();
        },
    });
})();
