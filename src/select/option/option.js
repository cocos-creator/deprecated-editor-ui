Polymer({
    publish: {
        value: -1,
        options: [],
        above: {
            value: false,
            reflect: true
        },
        searchable: {
            value: false,
            reflect: true
        },
        searchValue: '',
    },

    created: function () {
        this.owner = null;
    },

    clickAction: function (event, detail, sender) {
        var idx = parseInt(sender.getAttribute('index'));
        var entry = this.options[idx];
        if ( this.value !== entry.value ) {
            this.value = entry.value;
            if ( this.owner && this.owner.setValue )
                this.owner.setValue(this.value);
        }

        if ( this.owner ) {
            this.owner.fire('select', this.value);
            this.owner.focus();
        }

        event.stopPropagation();
    },

    applyFilter: function ( options, searchValue ) {
        var i = 0;
        return options.map( function ( item ) {
            item.index = i;
            i += 1;
            return item;
        })
        .filter( function ( item ) {
            return item.name.toLowerCase().indexOf(searchValue) !== -1;
        });
    },

    focusoutAction: function ( event ) {
        event.stopPropagation();

        if ( event.relatedTarget === null ) {
            if ( this.owner ) {
                this.owner.focus();
            }
            return;
        }
    },

});
