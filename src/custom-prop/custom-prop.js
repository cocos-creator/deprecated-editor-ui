(function () {
    Polymer({
        publish: {
            name: '',
            focused: {
                value: false,
                reflect: true
            },
        },

        attached: function () {
            if ( this.name === '' ) {
                var varName = this.attributes.value.value;
                varName = varName.replace( /{{(.*)}}/, "$1" );
                this.name = EditorUI.camelCaseToHuman(varName); 
            }
        },

        focusinAction: function ( event ) {
            this.focused = true;
            this.$.label.focused = true;
        },

        focusoutAction: function ( event ) {
            if ( this.focused === false )
                return;

            if ( EditorUI.find( this.shadowRoot, event.relatedTarget ) )
                return;

            this.focused = false;
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
    });
})();
