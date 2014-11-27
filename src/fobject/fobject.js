(function () {
    Polymer(EditorUI.mixin({
        publish: {
            value: null,
            type: "Fire.FObject",
        },

        ready: function () {
            this._init(this.$.focus);
        },

        blurAction: function (event) {
            if ( this.focused === false )
                return;

            if ( EditorUI.find( this.shadowRoot, event.relatedTarget ) )
                return;

            this._blurAction();
        },

        typeToName: function (val) {
            var name = val;
            if ( name.substr(0,5) === "Fire." ) {
                return name.substr(5);
            }
            return name;
        }
    }, EditorUI.focusable));
})();
