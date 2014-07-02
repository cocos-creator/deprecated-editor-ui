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
                        if ( this.enumType !== '' ) {
                            var enumTypeDef = FIRE.getVarFrom(window,this.enumType);
                            this.finalEnumList = FIRE.getEnumList(enumTypeDef);
                        }
                        else {
                            this.finalEnumList = this.enumList.slice(0);
                        }
                        fieldEL = new FireSelect(); 
                        fieldEL.bind( 'value',  new PathObserver(this,'value') );
                        fieldEL.options = this.finalEnumList;
                    }
                    else if ( this.type === 'int' ) {
                        fieldEL = new FireUnitInput();
                        fieldEL.bind( 'value',  new PathObserver(this,'value') );
                        fieldEL.type = 'int';
                    }
                    else if ( this.type === 'float' ) {
                        fieldEL = new FireUnitInput();
                        fieldEL.bind( 'value',  new PathObserver(this,'value') );
                        fieldEL.type = 'float';
                    }
                    break;

                case "boolean":
                    fieldEL = new FireCheckbox();
                    fieldEL.bind( 'value',  new PathObserver(this,'value') );
                    break;

                case "string":
                    if ( this.textMode === 'single' ) {
                        fieldEL = new FireTextInput();
                        fieldEL.bind( 'value', new PathObserver(this,'value') );
                    }
                    // else if ( this.textMode === 'multi' ) {
                    //     labelEL = compileLabelEL(this,'flex-1 flex-align-self-start');
                    //     fieldEL = $compile( "<fire-ui-text-area class='flex-2' fi-bind='bind'></fire-ui-text-area>" )( this );
                    // }
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
                                fieldEL.bind( 'value', new PathObserver(this,'value') );
                                break;

                            // case "FIRE.Vec2":
                            //     labelEL = compileLabelEL(this,'flex-1');
                            //     fieldEL = $compile( "<fire-ui-vec2 class='flex-2' fi-bind='bind'></fire-ui-vec2>" )( this );
                            //     break;
                        }
                    }
                    break;
            }

            fieldEL.classList.add('flex-2');
            fieldEL.id = "field";
            this.shadowRoot.appendChild(fieldEL);
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
            if ( this !== event.target &&
                 this.$.label !== event.target &&
                 FIRE.find( this.$.label.shadowRoot, event.target ) === false )
            {
                return;
            }

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
