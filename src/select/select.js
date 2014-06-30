(function () {
    Polymer('fire-ui-select', {
        focused: false,
        showMenu: false,

        observe: {
            value: 'updateValueName',
        },

        ready: function () {
            this.$.select.tabIndex = FIRE.getParentTabIndex(this)+1;
        },

        onClick: function () {
            this.showMenu = !this.showMenu;
        },

        onFocusIn: function () {
            this.focused = true;
        },

        onFocusOut: function () {
            if ( this.focused ) {
                if ( FIRE.find( this, event.relatedTarget ) === false ) {
                    this.focused = false;
                    this.showMenu = false;
                }
            }
        },

        onKeyDown: function () {
            switch ( event.which ) {
                // esc
                case 27:
                    this.blur();
                break;
            }
        },

        updateValueName: function () {
            for ( var i = 0; i < this.options.length; ++i ) {
                var entry = this.options[i];
                if ( entry.value === this.value ) {
                    this.valueName = entry.name;
                    break;
                }
            }
        },

        onSelect: function (event, detail, sender) {
            var idx = parseInt(sender.getAttribute('index'));
            var entry = this.options[idx];
            this.value = entry.value;
            this.showMenu = false;

            event.stopPropagation();
        },
    });
})();

