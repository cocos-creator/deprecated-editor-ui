Polymer({
    publish: {
        options: [
        { name: 'Hello',   value: 0 },
        { name: 'Foo',  value: 1 },
        { name: 'Bar',  value: 2 },
        { name: 'Johnny',  value: 3 },
        { name: 'Test Math', value: 4 },
        { name: 'Foo Bar', value: 5 },
        { name: 'This is the world', value: 6 },
        ]
    },

    selectAction: function (event, detail, sender) {
        var select =new FireSelect();
        var idx = parseInt(sender.getAttribute('index'));
        var entry = this.options[idx];
        if ( select.value !== entry.value ) {
            select.value = entry.value;
            this.fire('changed');
        }
        select.showMenu = false;
        //console.log(entry);
    }
});
