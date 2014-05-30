(function () {
    Polymer('fire-ui-select', {
        ready: function() {
            this.showMenu = false;
            this.valueName = this.getValueName();
        },

        onClick: function () {
            this.showMenu = !this.showMenu;
        },

        onKeyDown: function () {
            switch ( event.which ) {
                // esc
                case 27:
                    this.showMenu = false;
                break;
            }
        },

        onSelect: function (event, detail, sender) {
            var idx = parseInt(sender.getAttribute('index'));
            var entry = this.options[idx];
            this.value = entry.value;
            this.valueName = entry.name;
        },

        onFocusOut: function () {
            this.showMenu = false;
        },

        getValueName: function () {
            for ( var i = 0; i < this.options.length; ++i ) {
                var entry = this.options[i];
                if ( entry.value === this.value ) {
                    return entry.name;
                }
            }
        },
    });
})();

