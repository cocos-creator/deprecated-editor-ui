(function () {
    Polymer('fire-ui-checkbox', {
        publish: {
            value: false,
        },

        created: function () {
            this.focused = false;
        },

        ready: function () {
            this.$.focus.tabIndex = FIRE.getParentTabIndex(this)+1;
        },

        focusAction: function (event) {
            this.focused = true;
            this.classList.toggle('focused', this.focused);
        },

        blurAction: function (event) {
            if ( this.focused === false )
                return;

            if ( FIRE.find( this.shadowRoot, event.relatedTarget ) )
                return;

            this.focused = false;
            this.classList.toggle('focused', this.focused);
        },

        clickAction: function (event) {
            this.value = !this.value;
            event.stopPropagation();
        },

        checkedChanged: function() {
            this.fire('change');
        },
    });
})();
