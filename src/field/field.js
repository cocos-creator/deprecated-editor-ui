Polymer({
    publish: {
        value: null,
        type: null,
        enumType: null,
        enumList: null,
        textMode: 'single',
    },

    domReady: function () {
        var fieldEL = this.createFieldElement();

        if ( fieldEL === null ) {
            Fire.error("Failed to create field");
            return;
        }

        fieldEL.setAttribute('flex-auto','');
        fieldEL.bind( 'value', new PathObserver(this,'value') );
        this.shadowRoot.appendChild(fieldEL);
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
            var classDef = Fire.getClassById(typename);

            if ( Array.isArray(this.value) ) {
                typename = 'array';
            }
            else if ( Fire.isChildClassOf(classDef, Fire.FObject) ) {
                typename = 'fobject';
            }
            else {
                typename = Fire.getClassId(this.value);
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
