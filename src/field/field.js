Polymer({
    publish: {
        value: null,
        type: null,
        enumType: null,
        enumList: null,
        textMode: 'single',
    },

    created: function () {
        // NOTE: the call back will execute code after prop field created,
        //       sometimes we need to initialize fields, for example in fire-inspector
        //       the field will be disabled depends on watch values. And this callback
        //       make sure the tabIndex initialize after all elements are ready.
        this.onFieldCreated = null;
    },

    attached: function () {
        var fieldEL = this.createFieldElement();

        if ( fieldEL === null ) {
            Fire.error("Failed to create field");
            return;
        }

        fieldEL.setAttribute('flex-2','');
        fieldEL.bind( 'value', new PathObserver(this,'value') );
        fieldEL.setAttribute( 'value', '{{value}}' );
        fieldEL.id = "field";
        this.shadowRoot.appendChild(fieldEL);
        this.$.field = fieldEL;

        if ( this.onFieldCreated ) {
            this.onFieldCreated();
        }
    },

    createFieldElement: function () {
        // do dom transform
        var fieldEL = null;
        var enumTypeDef = null;

        // get typename
        var typename = this.type;
        switch ( typeof this.value ) {
        case "number":
            if ( !typename ) {
                typename = 'float';
            }
            break;

        case "boolean":
            typename = 'boolean';
            break;

        case "string":
            typename = 'string';
            break;

        case "object":
            var classDef = Fire.getClassByName(typename);

            if ( Array.isArray(this.value) ) {
                typename = 'array';
            }
            else if ( Fire.isChildClassOf(classDef, Fire.FObject) ) {
                typename = 'fobject';
            }
            else {
                typename = Fire.getClassName(this.value);
            }
            break;

        default:
            typename = 'unknown';
            break;
        }

        // process typename
        switch ( typename ) {
            case "enum":
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

            case "fobject":
                fieldEL = new FireFObject();
                fieldEL.type = this.type ? this.type : "Fire.FObject";
                break;

            case "array":
                // TODO
                break;

            case "Fire.Color":
                fieldEL = new FireColor();
                break;

            case "Fire.Vec2":
                fieldEL = new FireVec2();
                break;
        }

        return fieldEL;
    },
});
