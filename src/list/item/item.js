(function () {
    Polymer('fire-ui-li', {
        created: function () {
            this.selected = false;
        },

        delClickAction: function ( event ) {
            this.fire("delete");
            event.stopPropagation();
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
            this.classList.toggle('selected', this.selected);
        },

        unselect: function () {
            if ( this.selected === false )
                return;

            this.selected = false;
            this.classList.toggle('selected', this.selected);
        },
    });
})();
