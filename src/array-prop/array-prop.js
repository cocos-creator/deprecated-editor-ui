Polymer({
    publish: {
        value: null,
        min: null,
        max: null,
        type: null,
        ctor: null,
        enumType: null,
        enumList: null,
        textMode: 'single',
    },

    created: function () {
        this.cloneList = [];
    },

    indexName: function ( index ) {
        return "[" + index + "]";
    },

    clone: function () {
        this.cloneList = this.value.map( function ( item ) {
            return { value: item };
        });
    },

    valueChanged: function ( oldValue, newValue ) {
        if ( this.value.length != this.cloneList.length ) {
            this.clone();
            return;
        }

        for ( var i = 0; i < this.value.length; ++i ) {
            if ( this.cloneList[i].value !== this.value[i] ) {
                this.cloneList[i].value = this.value[i];
            }
        }
    },

    itemChangedAction: function ( event ) {
        event.stopPropagation();

        var idx = event.target.index;
        this.value[idx] = event.target.value;
        this.cloneList[idx].value = event.target.value;

        this.fire('changed');
    },
});
