(function () {
    Polymer('fire-ui-checkbox', {
        focused: false,
        checked: false,

        ready: function () {
            this.$.checkbox.tabIndex = FIRE.getParentTabIndex(this)+1;
        },

        onFocusIn: function () {
            this.focused = true;
        },

        onFocusOut: function () {
            if ( this.focused ) {
                if ( FIRE.find( this, event.relatedTarget ) === false ) {
                    this.focused = false;
                }
            }
        },

        onClick: function () {
            this.checked = !this.checked;
        },
    });
})();
