(function () {
    Polymer({
        publish: {
            value: null,
            type: "Fire.FObject",
            focused: {
                value: false,
                reflect: true
            },
        },

        ready: function () {
            this.$.focus.tabIndex = EditorUI.getParentTabIndex(this)+1;
            this.$.focus2.tabIndex = EditorUI.getParentTabIndex(this)+1;
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

        typeToName: function (val) {
            var name = val;
            if ( name.substr(0,5) === "Fire." ) {
                return name.substr(5);
            }
            return name;
        }
    });
})();
