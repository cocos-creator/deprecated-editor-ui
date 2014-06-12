(function () {
    Polymer('fire-ui-select', {
        showMenu: false,
        observe: {
            value: 'updateValueName',
        },

        onClick: function () {
            this.showMenu = !this.showMenu;
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

        onFocusOut: function () {
            this.showMenu = false;
        },
    });
})();

