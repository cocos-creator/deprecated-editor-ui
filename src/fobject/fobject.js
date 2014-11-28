(function () {
    Polymer(EditorUI.mixin({
        publish: {
            value: null,
            type: "Fire.FObject",
        },

        ready: function () {
            this._init(this.$.focus);
        },

        typeToName: function (val) {
            var name = val;
            if ( name.substr(0,5) === "Fire." ) {
                return name.substr(5);
            }
            return name;
        },

        blurAction: function (event) {
            if ( this.focused === false )
                return;

            if ( EditorUI.find( this.shadowRoot, event.relatedTarget ) )
                return;

            this._blurAction();
        },

        borderClickAction: function (event) {
            if ( Fire.hintObject ) {
                Fire.hintObject(this.value);
            }
        },

        browseClickAction: function (event) {
            if ( Fire.browseObject ) {
                Fire.browseObject(this.type);
            }
        },

    }, EditorUI.focusable));
})();
