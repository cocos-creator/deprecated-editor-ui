(function () {
    Polymer({
        publish: {
            value: null,
            type: null,
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

            fieldEL.setAttribute('flex-2','');
            fieldEL.bind( 'value', new PathObserver(this,'value') );
            fieldEL.id = "field";
            this.shadowRoot.appendChild(fieldEL);
            this.$.field = fieldEL;
        },

        createFieldElement: function () {
            // do dom transform
            var fieldEL = null;
            var enumTypeDef = null;
            var typename = this.type;
            if ( !typename ) {
                typename = typeof this.value;
                if ( typename === 'number' ) {
                    typename = 'float';
                }
            }

            switch ( typename ) {
                case "enum":
                    if ( this.type === 'enum' ) {
                        if ( this.enumType !== null ) {
                            enumTypeDef = Fire.getVarFrom(window,this.enumType);
                            this.finalEnumList = Fire.getEnumList(enumTypeDef);
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
                    break;

                case "int":
                    fieldEL = new FireUnitInput();
                    fieldEL.type = 'int';
                    break;

                case "float":
                    fieldEL = new FireUnitInput();
                    fieldEL.type = 'float';
                    break;

                case "string":
                    if ( this.textMode === 'single' ) {
                        fieldEL = new FireTextInput();
                    }
                    else if ( this.textMode === 'multi' ) {
                        this.$.label.setAttribute('flex-self-start','');
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
                        var className = Fire.getClassName(this.value);
                        switch ( className ) {
                            case "Fire.Color":
                                fieldEL = new FireColor();
                                break;

                            case "Fire.Vec2":
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
