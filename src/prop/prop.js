(function () {
    Polymer('fire-ui-prop', {
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
                this.name = FIRE.camelCaseToHuman(varName); 
            }

            var fieldEL = this.createFieldElement();
            if ( fieldEL === null ) {
                console.error("Failed to create field " + this.name );
                return;
            }

            fieldEL.setAttribute('flex-2','');
            fieldEL.bind( 'value', new PathObserver(this,'value') );
            fieldEL.id = "field";
            this.$.focus.appendChild(fieldEL);
            this.$.field = fieldEL;
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

            var focusableEL = EditorUI.getFirstFocusableChild(this.$.field.shadowRoot);
            if ( focusableEL ) {
                focusableEL.focus();
            }

            event.preventDefault();
            event.stopPropagation();

            return;
        }
    });
})();
