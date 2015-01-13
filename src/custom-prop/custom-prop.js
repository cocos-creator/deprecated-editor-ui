Polymer(EditorUI.mixin({
    publish: {
        name: '',
    },

    _generated: false,

    ready: function () {
        this._initFocusable();
    },

    attached: function () {
        if ( this._generated )
            return;
        this._generated = true;

        if ( this.name === '' ) {
            var varName = this.attributes.value.value;
            varName = varName.replace( /{{(.*)}}/, "$1" );
            this.name = EditorUI.camelCaseToHuman(varName); 
        }
    },

    focusinAction: function ( event ) {
        this._focusAction();
        this.$.label.focused = true;
    },

    focusoutAction: function ( event ) {
        if ( this.focused === false )
            return;

        this._blurAction();
        this.$.label.focused = false;
    },

    mousedownAction: function ( event ) {
        if ( this.$.focus !== event.target &&
             this.$.label !== event.target && 
             EditorUI.find(this.$.label, event.target) === false )
            return;

        var focusableEL = EditorUI.getFirstFocusableChild(this);
        if ( focusableEL ) {
            focusableEL.focus();
        }

        event.preventDefault();
        event.stopPropagation();

        return;
    }
}, EditorUI.focusable));
