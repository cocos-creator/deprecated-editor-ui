(function () {
    Polymer('fire-ui-field', {
        publish: {
            value: null,
            type: '',
            enumType: null,
            enumList: null,
            textMode: 'single',
        },

        attached: function () {
            var fieldEL = this.createFieldElement();

            if ( fieldEL === null ) {
                console.error("Failed to create field" );
                return;
            }

            fieldEL.classList.add('flex-2');
            fieldEL.bind( 'value', new PathObserver(this,'value') );
            fieldEL.id = "field";
            this.shadowRoot.appendChild(fieldEL);
            this.$.field = fieldEL;
        },

        createFieldElement: function () {
            // do dom transform
            var typename = typeof this.value;
            var fieldEL = null;
            var enumTypeDef = null;

            switch ( typename ) {
                case "number":
                    if ( this.type === 'enum' ) {
                        if ( this.enumType !== null ) {
                            enumTypeDef = FIRE.getVarFrom(window,this.enumType);
                            this.finalEnumList = FIRE.getEnumList(enumTypeDef);
                        }
                        else {
                            if ( this.enumList !== null ) {
                                this.finalEnumList = this.enumList.slice(0);
                            }
                        }
                        if ( this.finalEnumList ) {
                            fieldEL = new FireSelect(); 
                            fieldEL.options = this.finalEnumList;
                        }
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

                case "string":
                    if ( this.type === 'enum' ) {
                        if ( this.enumType !== null ) {
                            enumTypeDef = FIRE.getVarFrom(window,this.enumType);
                            this.finalEnumList = FIRE.getEnumList(enumTypeDef);
                        }
                        else {
                            if ( this.enumList !== null ) {
                                this.finalEnumList = this.enumList.slice(0);
                            }
                        }
                        if ( this.finalEnumList ) {
                            fieldEL = new FireSelect(); 
                            fieldEL.options = this.finalEnumList;
                        }
                    }
                    else if ( this.textMode === 'single' ) {
                        fieldEL = new FireTextInput();
                    }
                    else if ( this.textMode === 'multi' ) {
                        this.$.label.classList.add('flex-align-self-start');
                        fieldEL = new FireTextArea();
                    }
                    break;

                case "boolean":
                    fieldEL = new FireCheckbox();
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

            return fieldEL;
        },
    });
})();
