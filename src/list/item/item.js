Polymer({
    publish: {
        value: null,
        selected: {
            reflect: true,
            value: false,
        },
        icon: {
            reflect: true,
            value: false,
        }
    },

    toggle: function () {
        if ( this.selected ) {
            this.unselect();
        }
        else {
            this.select();
        }
    },

    select: function () {
        if ( this.selected )
            return;

        this.selected = true;
    },

    unselect: function () {
        if ( this.selected === false )
            return;

        this.selected = false;
    },
});
