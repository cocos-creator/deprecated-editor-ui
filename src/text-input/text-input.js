(function () {
    Polymer('fire-ui-text-input', {
        focused: false,
        value: '',

        ready: function() {
            this.$.input.tabIndex = FIRE.getParentTabIndex(this)+1;
        },

        valueChanged: function () {
            this.$.input.value = this.value;
        },

        focusAction: function (event) {
            this.lastVal = this.value;
            this.focused = true;
            this.classList.toggle('focused', this.focused);
        },

        blurAction: function (event, detail, sender) {
            if ( this.focused === false )
                return;

            if ( FIRE.find( this.shadowRoot, event.relatedTarget ) )
                return;

            var val = this.value;
            this.value = val;
            this.$.input.value = val;

            this.focused = false;
            this.classList.toggle('focused', this.focused);
        },

        inputAction: function (event) {
            this.value = event.target.value;

            event.stopPropagation();
        },

        inputClickAction: function (event) {
            event.stopPropagation();
        },

        inputKeyDownAction: function (event) {
            switch ( event.which ) {
                // enter
                case 13:
                    this.blur();
                break;

                // esc
                case 27:
                    this.$.input.value = this.lastVal;
                    this.blur();
                break;
            }
            event.stopPropagation();
        },
    });
})();
