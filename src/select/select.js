(function () {
    Polymer('fire-ui-select', {
        focused: false,
        showMenu: false,

        observe: {
            value: 'updateValueName',
        },

        ready: function () {
            this.tabIndex = FIRE.getParentTabIndex(this)+1;
        },

        clickAction: function (event) {
            this.showMenu = !this.showMenu;

            event.stopPropagation();
        },

        // focusInAction: function () {
        //     this.focused = true;
        // },

        // focusOutAction: function () {
        //     if ( this.focused ) {
        //         if ( FIRE.find( this, event.relatedTarget ) === false ) {
        //             this.focused = false;
        //             this.showMenu = false;
        //         }
        //     }
        // },

        keyDownAction: function (event) {
            switch ( event.which ) {
                // esc
                case 27:
                    this.blur();
                break;
            }

            event.stopPropagation();
        },

        selectAction: function (event, detail, sender) {
            var idx = parseInt(sender.getAttribute('index'));
            var entry = this.options[idx];
            this.value = entry.value;
            this.showMenu = false;

            event.stopPropagation();
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
    });
})();

