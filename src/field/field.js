var defaultValues = {
    'undefined': undefined,
    'enum': -1,
    'int': 0,
    'float': 0.0,
    'string': '',
    'boolean': false,
    'fobject': null,
    'Fire.Color': new Fire.Color(0,0,0,1),
    'Fire.Vec2': new Fire.Vec2(0,0),
};

function getDefaultType ( typename, additionalType ) {
    var result;

    if ( typename === 'array' ) {
        // proctect array with array
        if ( additionalType === 'array' )
            return null;

        result = defaultValues[additionalType];
        if ( result === undefined )
            return null;

        return result;
    }

    result = defaultValues[typename];
    if ( result === undefined )
        return null;

    return result;
}

Polymer({
    publish: {
        value: null,
        type: null,
        enumType: null,
        enumList: null,
        textMode: 'single',
    },

    _defaultType: null, // used in array resize, confirm when type detected

    domReady: function () {
        var fieldEL = this.createFieldElement();
        if ( fieldEL === null ) {
            Fire.error("Failed to create field");
            return;
        }

        fieldEL.setAttribute('flex-auto','');
        if ( Array.isArray(this.value) ) {
            fieldEL.bind( 'value', new PathObserver(this,'value.length') );
            fieldEL.addEventListener( 'changed', function ( event ) {
                if ( this.value.length > 0 ) {
                    Fire.arrayFillUndefined( this.value, this._defaultType );
                }
            }.bind(this));
        }
        else {
            fieldEL.bind( 'value', new PathObserver(this,'value') );
        }
        this.shadowRoot.appendChild(fieldEL);
    },

    createFieldElement: function () {
        // do dom transform
        var fieldEL = null;
        var enumTypeDef = null;

        // get typename
        var typename = this.type;
        switch ( typeof this.value ) {
        case "undefined":
            typename = 'undefined';
            break;

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
            case "undefined":
                fieldEL = new FireLabel();
                fieldEL.innerText = 'Undefined';
                fieldEL.disabled = true;
                break;

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
                fieldEL = new FireUnitInput();
                fieldEL.type = 'int';
                fieldEL.min = 0;
                fieldEL.unit = 'size';
                break;

            case "Fire.Color":
                fieldEL = new FireColor();
                break;

            case "Fire.Vec2":
                fieldEL = new FireVec2();
                break;
        }

        this._defaultType = getDefaultType(typename,this.type);
        return fieldEL;
    },
});
