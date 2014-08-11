(function () {
    Polymer('fire-ui-dock', {
        created: function () {
        },

        ready: function () {
            var isrow = this.isRow();

            for ( var i = 0; i < this.children.length; ++i ) {
                if ( i != this.children.length-1 ) {
                    var dockEL = this.children[i];
                    if ( dockEL instanceof FireDock ) {
                        var resizer = new FireResizer();
                        resizer.vertical = isrow;

                        // NOTE: it is possible resize target is null (dockEL and dockEL.nextElementSibling are all flex)
                        if ( EditorUI.isFlex(dockEL) === false ) {
                            resizer.target = dockEL;
                        }
                        else {
                            if ( EditorUI.isFlex(dockEL.nextElementSibling) === false ) {
                                resizer.target = dockEL.nextElementSibling;
                            }
                        }
                        resizer.ready(); // HACK: ready again, manual contructor cannot send attribute in 

                        this.insertBefore( resizer, dockEL.nextElementSibling );
                        i += 1;
                    }
                }
            }
        },

        isRow: function () {
            var result = this.getAttribute('flex-row');
            if ( result === null )
                return false;
            return true;
        },
    });
})();
