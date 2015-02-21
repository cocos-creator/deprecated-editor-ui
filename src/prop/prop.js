Polymer(EditorUI.mixin({
    publish: {
        name: '',
        value: null,
        min: null,
        max: null,
        type: null,
        ctor: null,
        enumType: null,
        enumList: null,
        textMode: 'single',

        foldable: {
            value: false,
            reflect: true,
        },

        folded: {
            value: false,
            reflect: true,
        },

        index: -1, // used in array-prop
    },

    created: function () {
        // NOTE: the call back will execute code after prop field created,
        //       sometimes we need to initialize fields, for example in fire-inspector
        //       the field will be disabled depends on watch values. And this callback
        //       make sure the tabIndex initialize after all elements are ready.
        this.onFieldCreated = null;
        this.folded = true;
        this.compoundType = 'none';
    },

    ready: function () {
        this._initFocusable();
    },

    domReady: function () {
        if ( this.name === '' ) {
            var varName = this.attributes.value.value;
            varName = varName.replace( /{{(.*)}}/, "$1" );
            this.name = EditorUI.camelCaseToHuman(varName);
        }

        if ( this.textMode === 'multi') {
            this.$.label.setAttribute('flex-self-start','');
        }

        this.updateCompound();

        if ( this.onFieldCreated ) {
            this.onFieldCreated();
        }
    },

    initWithAttrs: function ( obj, propName, attrs ) {
        this.id = propName;

        //
        this.bind( 'value', new Fire._PathObserver( obj, propName ) );

        //
        this.ctor = attrs.ctor;
        this.type = attrs.type;
        if ( this.type === 'enum' ) {
            this.enumList = attrs.enumList;
        }

        //
        if ( attrs.displayName ) {
            this.name = attrs.displayName;
        }
        else {
            this.name = EditorUI.camelCaseToHuman(propName);
        }

        if ( attrs.textMode ) {
            this.textMode = attrs.textMode;
        }

        // NOTE: min, max can be null
        if ( attrs.min !== undefined )
            this.min = attrs.min;

        if ( attrs.max !== undefined )
            this.max = attrs.max;

        //
        if ( attrs.watch && attrs.watchCallback ) {
            if ( attrs.watch.length > 0 ) {
                var observer = new CompoundObserver();
                for ( var i = 0; i < attrs.watch.length; ++i ) {
                    observer.addObserver( new Fire._PathObserver( obj, attrs.watch[i] ) );
                }
                var watcher = function () {
                    attrs.watchCallback( obj, this );
                }.bind(this);
                observer.open(watcher);

                // NOTE: we need to invoke it once to make sure our this intialize correctly
                this.onFieldCreated = watcher;
            }
        }
        else {
            this.onFieldCreated = function () {
                if ( attrs.readOnly || (attrs.hasGetter && !attrs.hasSetter) ) {
                    this.disabled = true;
                }
            };
        }
    },

    isCompoundField: function () {
        if ( this.value === null || this.value === undefined ) {
            return false;
        }

        if ( typeof this.value === "object" ) {
            if ( Array.isArray(this.value) ) {
                return true;
            }
            else {
                var ctor = this.ctor;
                if ( !ctor ) {
                    ctor = this.value.constructor;
                }
                var classname = Fire.JS.getClassName(ctor);

                if ( Fire.isChildClassOf(ctor, Fire.FObject) ) {
                    return false;
                }
                else {
                    if ( [
                        "Fire.Vec2",
                        "Fire.Color",
                    ].indexOf(classname) === -1 ) {
                        return true;
                    }
                }
            }
        }

        return false;
    },

    updateCompound: function () {
        this.foldable = this.isCompoundField();
        if ( this.foldable ) {
            if ( Array.isArray(this.value) )
                this.compoundType = 'array';
            else
                this.compoundType = 'object';
        }
        else {
            this.compoundType = 'none';
        }
    },

    valueChanged: function ( oldValue, newValue ) {
        if ( newValue === null ) {
            if ( oldValue !== null && !(oldValue instanceof Fire.FObject) ) {
                this.updateCompound();
            }
        }
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
             this.$.fold !== event.target &&
             EditorUI.find(this.$.label, event.target) === false )
            return;

        var focusableEL = EditorUI.getFirstFocusableChild(this.$.field.shadowRoot);
        if ( focusableEL ) {
            focusableEL.focus();
        }

        event.preventDefault();
        event.stopPropagation();

        return;
    },

    foldAction: function ( event ) {
        event.stopPropagation();

        this.folded = !this.folded;
    },

    nullChangedAction: function ( event ) {
        this.updateCompound();
    },

}, EditorUI.focusable));
