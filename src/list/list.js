(function () {
    Polymer('fire-ui-list', {
        created: function () {
            this.focused = false;
            this.selection = [];
        },

        ready: function () {
            this.$.focus.tabIndex = FIRE.getParentTabIndex(this)+1;
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

            this.clearSelect();
            this.focused = false;
            this.classList.toggle('focused', this.focused);
        },

        deleteAction: function (event, detail, sender) {
            console.log("deleteAction");
            event.stopPropagation();
        },

        clickAction: function (event) {
            if ( event.target instanceof FireListItem ) {
                this.clearSelect();
                this.select( [event.target] );
            }
            event.stopPropagation();
        },

        select: function ( items ) {
            for ( var i = 0; i < items.length; ++i ) {
                var item = items[i];
                if ( item.selected === false ) {
                    this.selection.push(item);
                    item.select();
                }
            }
        },

        unselect: function ( items ) {
            for ( var i = 0; i < items.length; ++i ) {
                var item = items[i];
                if ( item.selected ) {
                    item.unselect();
                    this.selection.splice(i,1);
                }
            }
        },

        clearSelect: function () {
            this.unselect(this.selection);
            this.selection = [];
        },
    });
})();
