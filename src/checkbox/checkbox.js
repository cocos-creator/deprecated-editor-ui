(function () {
    Polymer({
        publish: {
            value: false,
            focused: {
                value: false,
                reflect: true
            },
            disabled: {
                value: false,
                reflect: true
            }
        },

        ready: function () {
            this.$.focus.tabIndex = EditorUI.getParentTabIndex(this)+1;
        },

        focusAction: function (event) {
            if (this.isDisabled())
                return;
            this.focused = true;
        },

        blurAction: function (event) {
            if ( this.focused === false )
                return;

            if ( EditorUI.find( this.shadowRoot, event.relatedTarget ) )
                return;

            this.focused = false;
        },

        clickAction: function (event) {
            if (this.disabled)
                return;
            this.value = !this.value;
            this.fire('changed');
            event.stopPropagation();
        },

        isDisabled: function(){
            if (this.disabled) {
                return true;
            }
            var parent = this.parentElement;
            while(parent) {
                if(parent.disabled)
                    return true;
                parent = parent.parentElement;
            }
            return false;
        },
    });
})();
