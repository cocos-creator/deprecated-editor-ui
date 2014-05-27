(function () {
    Polymer('fire-ui-checkbox', {
        ready: function() {
        },
        onClick: function () {
            this.checked = !this.checked;
        },
    });
})();
