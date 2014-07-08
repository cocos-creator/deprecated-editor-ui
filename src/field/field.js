(function () {
    Polymer('fire-ui-field', {
        focused: false,
        textMode: 'single',
        name: '',
        type: '',
        value: null,
        enumType: null,
        enumList: null,

        ready: function () {
            if ( this.name === '' ) {
                var varName = this.attributes.value.value;
                varName = varName.replace( /{{(.*)}}/, "$1" );
                this.name = FIRE.camelCaseToHuman(varName); 
            }

            // do dom transform
            var typename = typeof this.value;
            var fieldEL = null;

            switch ( typename ) {
                case "number":
                    if ( this.type === 'enum' ) {
                        if ( this.enumType !== null ) {
                            var enumTypeDef = FIRE.getVarFrom(window,this.enumType);
                            this.finalEnumList = FIRE.getEnumList(enumTypeDef);
                        }
                        else {
                            this.finalEnumList = this.enumList.slice(0);
                        }
                        fieldEL = new FireSelect(); 
                        fieldEL.options = this.finalEnumList;
                    }
                    else if ( this.type === 'int' ) {
                        fieldEL = new FireUnitInput();
                        fieldEL.type = 'int';
                    }
                    else if ( this.type === 'float' ) {
                        fieldEL = new FireUnitInput();
                        fieldEL.type = 'float';
                    }
                    break;

                case "boolean":
                    fieldEL = new FireCheckbox();
                    break;

                case "string":
                    if ( this.textMode === 'single' ) {
                        fieldEL = new FireTextInput();
                    }
                    else if ( this.textMode === 'multi' ) {
                        this.$.label.classList.add('flex-align-self-start');
                        fieldEL = new FireTextArea();
                    }
                    break;

                case "object":
                    if ( Array.isArray(this.bind) ) {
                        // TODO
                    }
                    else {
                        var className = FIRE.getClassName(this.value);
                        switch ( className ) {
                            case "FIRE.Color":
                                fieldEL = new FireColor();
                                break;

                            case "FIRE.Vec2":
                                fieldEL = new FireVec2();
                                break;
                        }
                    }
                    break;
            }

            if ( fieldEL === null ) {
                console.Error("Failed to create field " + this.name );
                return;
            }

            fieldEL.classList.add('flex-2');
            fieldEL.bind( 'value', new PathObserver(this,'value') );
            fieldEL.id = "field";
            // this.shadowRoot.appendChild(fieldEL);
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
