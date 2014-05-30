(function () {
    Polymer('fire-ui-unitinput', {
        ready: function() {
            this.focused = false;
        },

        onFocusIn: function () {
            this.lastVal = this.value;
            this.focused = true;
        },

        onFocusOut: function () {
            this.focused = false;
        },

        onInput: function () {
            this.value = this.$.input.value;
        },

        onInputClick: function () {
            this.$.input.select();
        },

        onInputKeyDown: function () {
            switch ( event.which ) {
                // enter
                case 13:
                    this.$.input.blur(); 
                break;

                // esc
                case 27:
                    this.value = this.lastVal;
                    this.$.input.blur(); 
                break;
            }
        },

        onIncrease: function () {
            this.value += 1;
        },

        onDecrease: function () {
            this.value -= 1;
        },
    });
})();
