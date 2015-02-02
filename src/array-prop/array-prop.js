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

    indexName: function ( index ) {
        return "[" + index + "]";
    },
});
