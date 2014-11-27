(function () {
    Polymer({
        publish: {
            value: -1,
            options: [],
            above: {
                value: false,
                reflect: true
            },
        },

        clickAction: function (event, detail, sender) {
            var idx = parseInt(sender.getAttribute('index'));
            var entry = this.options[idx];
            if ( this.value !== entry.value ) {
                this.value = entry.value;
                if ( this.owner )
                    this.owner.fire('changed');
            }

            if ( this.owner )
                this.owner.fire('select', this.value);

            event.stopPropagation();
        },
    });
})();
