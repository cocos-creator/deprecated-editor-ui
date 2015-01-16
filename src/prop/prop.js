Polymer(EditorUI.mixin({
    publish: {
        name: '',
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
             EditorUI.find(this.$.label, event.target) === false )
            return;

        var focusableEL = EditorUI.getFirstFocusableChild(this.$.field.shadowRoot);
        if ( focusableEL ) {
            focusableEL.focus();
        }

        event.preventDefault();
        event.stopPropagation();

        return;
    }
}, EditorUI.focusable));
