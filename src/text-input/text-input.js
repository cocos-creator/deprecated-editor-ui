(function () {
    Polymer('fire-ui-text-input', {
        publish: {
            value: '',
            multiline: false,
            focused: {
                value: false,
                reflect: true
            },
        },

        ready: function() {
            this.$.inputArea.tabIndex = FIRE.getParentTabIndex(this)+1;
        },

        valueChanged: function () {
            this.$.inputArea.value = this.value;
            // if ( this.multiline ) {
            //     this._adjust();
            // }
        },

        _adjust: function () {
            var areaEL = this.$.inputArea;

            // NOTE: this will make sure the scrollHeight calculate even we shrink it.
            areaEL.style.height = "0px";
            areaEL.style.height = areaEL.scrollHeight + "px";

            if ( areaEL.scrollWidth > areaEL.clientWidth &&
                 areaEL.style.overflowX !== 'hidden' )
            {
                var scrollBarHeight = areaEL.offsetHeight - areaEL.clientHeight;
                areaEL.style.height = (areaEL.scrollHeight + scrollBarHeight) + "px";
            }
        },

        focusAction: function (event) {
            this.lastVal = this.value;
            this.focused = true;
        },

        blurAction: function (event, detail, sender) {
            if ( this.focused === false )
                return;

            if ( FIRE.find( this.shadowRoot, event.relatedTarget ) )
                return;

            this.focused = false;
        },

        inputAction: function (event) {
            if ( this.value != event.target.value ) {
                this.value = event.target.value;
                this.fire('changed');
            }

            event.stopPropagation();
        },

        inputClickAction: function (event) {
            event.stopPropagation();
        },

        inputKeyDownAction: function (event) {
            // if ( this.multiline ) {
            //     switch ( event.which ) {
            //         // NOTE: enter will be used as new-line, ESC here will be confirm behavior
            //         // NOTE: textarea already have ctrl-z undo behavior
            //         // esc
            //         case 27:
            //             this.blur(); 
            //         return false;
            //     }
            // }
            // else {
                switch ( event.which ) {
                    // enter
                    case 13:
                        this.$.inputArea.blur();
                    break;

                    // esc
                    case 27:
                        if ( this.value != this.lastVal ) {
                            this.value = this.lastVal;
                            this.fire('changed');
                        }
                        this.$.inputArea.blur();
                    break;
                }
            // }
            event.stopPropagation();
        },
    });
})();
