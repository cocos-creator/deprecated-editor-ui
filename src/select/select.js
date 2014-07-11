(function () {
    Polymer('fire-ui-select', {
        publish: {
            value: -1,
            options: null, 
        },

        observe: {
            value: 'updateValueName',
        },

        created: function () {
            this.focused = false;
            this.showMenu = false;
        },

        ready: function () {
            this.$.focus.tabIndex = FIRE.getParentTabIndex(this)+1;
        },

        clickAction: function (event) {
            this.showMenu = !this.showMenu;

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

            this.showMenu = false;
            this.focused = false;
            this.classList.toggle('focused', this.focused);
        },

        keyDownAction: function (event) {
            switch ( event.which ) {
                // esc
                case 27:
                    this.blur();
                    event.stopPropagation();
                break;
            }
        },

        selectAction: function (event, detail, sender) {
            var idx = parseInt(sender.getAttribute('index'));
            var entry = this.options[idx];
            this.value = entry.value;
            this.showMenu = false;

            event.stopPropagation();
        },

        updateValueName: function () {
            if ( this.value == -1 )
                return;

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

