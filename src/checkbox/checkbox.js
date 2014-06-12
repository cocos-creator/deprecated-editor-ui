(function () {
    Polymer('fire-ui-checkbox', {
        focused: false,
        checked: false,

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
