Polymer(EditorUI.mixin({
    publish: {
        name: '',
        value: null,
        type: null,
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
        }
    },

    created: function () {
        // NOTE: the call back will execute code after prop field created,
        //       sometimes we need to initialize fields, for example in fire-inspector
        //       the field will be disabled depends on watch values. And this callback
        //       make sure the tabIndex initialize after all elements are ready.
        this.onFieldCreated = null;
        this.folded = true;
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

        this.foldable = Array.isArray(this.value);

        if ( this.onFieldCreated ) {
            this.onFieldCreated();
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
        this.folded = !this.folded;
        event.stopPropagation();
    },

}, EditorUI.focusable));
