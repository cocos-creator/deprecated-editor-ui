(function () {
    Polymer('fire-ui-checkbox', {
        ready: function() {
            this.focused = false;
        },

        onFocusIn: function () {
            this.focused = true;
        },

        onFocusOut: function () {
            this.focused = false;
        },

        onClick: function () {
            this.checked = !this.checked;
        },
    });
})();
