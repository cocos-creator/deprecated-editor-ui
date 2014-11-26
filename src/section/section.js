(function () {
    Polymer({
        publish: {
            name: '',
            focused: {
                value: false,
                reflect: true
            },
        },

        created: function () {
            this.folded = false;

            // TODO:
            // this.addEventListener( "keydown", function ( e ) {
            //     if ( e.keyCode === 9 ) {
            //         if ( e.shiftKey ) {
            //             console.log("up");
            //         }
            //         else {
            //             console.log("down");
            //         }
            //         e.preventDefault();
            //         e.stopPropagation();
            //     }
            // }, true );
        },

        ready: function() {
            this.$.title.tabIndex = EditorUI.getParentTabIndex(this)+1;
        },

        clickAction: function (event) {
            this.folded = !this.folded;
            event.stopPropagation();
        },

        focusAction: function (event) {
            this.focused = true;
        },

        blurAction: function (event) {
            if ( this.focused === false )
                return;

            if ( EditorUI.find( this.shadowRoot, event.relatedTarget ) )
                return;

            this.focused = false;
        },
    });
})();
