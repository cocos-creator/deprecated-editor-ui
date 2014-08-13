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
                        resizer.ready(); // HACK: ready again, manual contructor cannot send attribute in 

                        this.insertBefore( resizer, dockEL.nextElementSibling );
                        i += 1;
                    }
                }
            }
        },

        domReady: function () {
            for ( var i = 0; i < this.children.length; ++i ) {
                var resizer = this.children[i];
                if ( resizer instanceof FireResizer ) {
                    // NOTE: it is possible resize target is null (resizer.previousElementSibling and resizer.nextElementSibling are all flex)
                    if ( EditorUI.isFlex(resizer.previousElementSibling) === false ) {
                        resizer.inverse = false;
                        resizer.target = resizer.previousElementSibling;
                    }
                    else {
                        if ( EditorUI.isFlex(resizer.nextElementSibling) === false ) {
                            resizer.inverse = true;
                            resizer.target = resizer.nextElementSibling;
                        }
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

        dragEnterAction: function ( event ) {
            this.style.outline = "1px solid white";
        },

        dragOverAction: function ( event ) {
            this.style.outline = "1px solid white";
        },

        dragLeaveAction: function ( event ) {
            this.style.outline = "";
        },

        dropAction: function ( event ) {
        },
    });
})();
