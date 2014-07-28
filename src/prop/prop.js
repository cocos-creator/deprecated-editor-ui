(function () {
    Polymer('fire-ui-prop', {
        publish: {
            name: '',
        },

        created: function () {
            this.focused = false;
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

            fieldEL.classList.add('flex-2');
            fieldEL.bind( 'value', new PathObserver(this,'value') );
            fieldEL.id = "field";
            this.$.focus.appendChild(fieldEL);
            this.$.field = fieldEL;
        },

        focusinAction: function ( event ) {
            this.focused = true;
            this.classList.toggle('focused', this.focused);
            this.$.label.classList.toggle('focused', this.focused);
            this.$.field.classList.toggle('focused', this.focused);
        },

        focusoutAction: function ( event ) {
            if ( this.focused === false )
                return;

            if ( FIRE.find( this.shadowRoot, event.relatedTarget ) )
                return;

            this.focused = false;
            this.classList.toggle('focused', this.focused);
            this.$.label.classList.toggle('focused', this.focused);
            this.$.field.classList.toggle('focused', this.focused);
        },

        mousedownAction: function ( event ) {
            if ( this.$.focus !== event.target &&
                 this.$.label !== event.target && 
                 FIRE.find(this.$.label, event.target) === false )
                return;

            var focusableEL = FIRE.getFirstFocusableChild(this.$.field.shadowRoot);
            if ( focusableEL ) {
                focusableEL.focus();
            }

            event.preventDefault();
            event.stopPropagation();

            return;
        }
    });
})();
