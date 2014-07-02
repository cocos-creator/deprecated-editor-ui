(function () {
    Polymer('fire-ui-section', {
        title: '',
        folded: false,

        ready: function() {
            this.$.title.tabIndex = FIRE.getParentTabIndex(this)+1;
        },

        clickAction: function () {
            this.folded = !this.folded;
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
