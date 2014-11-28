(function () {
    Polymer(EditorUI.mixin({
        publish: {
            name: '',
        },

        ready: function () {
            this._init();
        },

        attached: function () {
            if ( this.name === '' ) {
                var varName = this.attributes.value.value;
                varName = varName.replace( /{{(.*)}}/, "$1" );
                this.name = EditorUI.camelCaseToHuman(varName); 
            }

            var fieldEL = this.createFieldElement();
            if ( fieldEL === null ) {
                Fire.error("Failed to create field " + this.name );
                return;
            }

            fieldEL.setAttribute('flex-2','');
            fieldEL.bind( 'value', new PathObserver(this,'value') );
            fieldEL.setAttribute( 'value', '{{value}}' );
            fieldEL.id = "field";
            this.appendChild(fieldEL);
            this.$.field = fieldEL;
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

            var focusableEL = EditorUI.getFirstFocusableChild(this.$.field.shadowRoot);
            if ( focusableEL ) {
                focusableEL.focus();
            }

            event.preventDefault();
            event.stopPropagation();

            return;
        }
    }, EditorUI.focusable));
})();
