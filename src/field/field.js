var defaultCtor = {
    'undefined': undefined,
    'enum': -1,
    'int': 0,
    'float': 0.0,
    'string': '',
    'boolean': false,
    'fobject': null,
    'Fire.Color': function () { return new Fire.Color(0,0,0,1); },
    'Fire.Vec2': function () { return new Fire.Vec2(0,0); },
};

function getDefaultValue ( typename, ctor ) {
    var result;

    //
    result = defaultCtor[typename];
    if ( result === undefined ) {
        if ( typename === 'object' &&
             !Fire.isChildClassOf(ctor, Fire.FObject) &&
             ctor )
        {
            return new ctor();
        }

        return null;
    }

    if ( typeof result === 'function' )
        return result();

    return result;
}

Polymer({
    publish: {
        value: null,
        min: null,
        max: null,
        type: null,
        ctor: null,
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

        this._appendFieldElement(fieldEL);
    },

    _appendFieldElement: function ( fieldEL ) {
        fieldEL.setAttribute('flex-auto','');
        if ( Array.isArray(this.value) ) {
            fieldEL.bind( 'value', new PathObserver(this,'value.length') );
            fieldEL.addEventListener( 'changed', function ( event ) {
                if ( this.value.length > 0 ) {
                    for ( var i = 0; i < this.value.length; ++i ) {
                        if ( this.value[i] !== undefined )
                            continue;

                        this.value[i] = getDefaultValue( this.type, this.ctor );
                    }
                }
            }.bind(this));
        }
        else {
            fieldEL.bind( 'value', new PathObserver(this,'value') );
        }
        this.shadowRoot.appendChild(fieldEL);
        this._fieldEL = fieldEL;
    },

    createFieldElement: function () {
        // check if this is a null field
        if ( (this.value === null || this.value === undefined) &&
             !Fire.isChildClassOf(this.ctor, Fire.FObject) )
        {
            fieldEL = new FireNull();
            fieldEL.type = this.type;
            fieldEL.ctor = this.ctor;
            return fieldEL;
        }

        // init type
        var typename = null;
        var classname = null;

        //
        switch ( typeof this.value ) {
        case "undefined":
            typename = "undefined";
            break;

        case "string":
            typename = this.type || "string";
            break;

        case "boolean":
            typename = this.type || "boolean";
            break;

        case "number":
            typename = this.type || "float";
            break;

        case "object":
            if ( Array.isArray(this.value) ) {
                typename = 'array';
            }
            else {
                var ctor = this.ctor;
                if ( !ctor ) {
                    ctor = this.value.constructor;
                }
                classname = Fire.getClassName(ctor);
                typename = 'object';

                if ( Fire.isChildClassOf(ctor, Fire.FObject) ) {
                    typename = 'fobject';
                }
                else {
                    if ( [
                        "Fire.Vec2",
                        "Fire.Color",
                    ].indexOf(classname) !== -1 ) {
                        typename = classname;
                    }
                }
            }
            break;

        default:
            Fire.error( "Unknown type " + (typeof this.value) );
            break;
        }

        // create fieldEL by typename
        var fieldEL = null;
        switch ( typename ) {
            case "undefined":
                fieldEL = new FireLabel();
                fieldEL.innerText = 'Undefined';
                fieldEL.disabled = true;
                break;

            case "enum":
                if ( this.enumType !== null ) {
                    var enumTypeDef = Fire.getVarFrom(window,this.enumType);
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
                fieldEL.setRange( this.min, this.max );
                break;

            case "float":
                if ( this.min !== null && this.max !== null ) {
                    fieldEL = new FireSlider();
                    fieldEL.type = 'float';
                    fieldEL.setRange( this.min, this.max );
                }
                else {
                    fieldEL = new FireUnitInput();
                    fieldEL.type = 'float';
                    fieldEL.setRange( this.min, this.max );
                }
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
                fieldEL.type = classname;
                break;

            case "array":
                fieldEL = new FireUnitInput();
                fieldEL.type = 'int';
                fieldEL.min = 0;
                fieldEL.unit = 'size';
                break;

            case "object":
                fieldEL = new FireLabel();
                if ( !classname || classname === 'Function' ) {
                    classname = 'annoyance';
                }

                fieldEL.innerText = '(' + classname + ')';
                fieldEL.disabled = true;
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

    recreateFieldElement: function () {
        if ( this._fieldEL ) {
            this._fieldEL.remove();
            this._fieldEL = null;
        }

        //
        var fieldEL = this.createFieldElement();
        if ( fieldEL === null ) {
            Fire.error("Failed to create field");
            return;
        }

        this._appendFieldElement(fieldEL);
    },

    valueChanged: function ( oldValue, newValue ) {
        if ( newValue === null ) {
            if ( oldValue !== null && !(oldValue instanceof Fire.FObject) ) {
                this.recreateFieldElement();
            }
        }
    },

    recreateFieldAction: function ( event ) {
        // NOTE: do not stopPropagation
        this.recreateFieldElement();
    },
});
