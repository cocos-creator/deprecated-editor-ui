(function () {
    Polymer('fire-ui-section', {
        created: function () {
            this.folded = false;
        },

        ready: function() {
            this.$.title.tabIndex = FIRE.getParentTabIndex(this)+1;
        },

        clickAction: function (event) {
            this.folded = !this.folded;
            event.stopPropagation();
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
    });
})();
