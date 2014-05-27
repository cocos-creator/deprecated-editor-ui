(function () {
    Polymer('fire-ui-unitinput', {
        ready: function() {
            this.unitinput = this.shadowRoot.querySelector('.fire-ui-unitinput');
        },

        onFocusIn: function () {
            this.unitinput.classList.add('focused');
        },

        onFocusOut: function () {
            this.unitinput.classList.remove('focused');
        },
    });
})();
