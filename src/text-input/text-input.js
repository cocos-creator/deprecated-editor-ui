(function () {
    Polymer('fire-ui-text-input', {
        created: function () {
            this.focused = false;
            this.value = '';
            // this.multiline = false;
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
            this.classList.toggle('focused', this.focused);
        },

        blurAction: function (event, detail, sender) {
            if ( this.focused === false )
                return;

            if ( FIRE.find( this.shadowRoot, event.relatedTarget ) )
                return;

            this.focused = false;
            this.classList.toggle('focused', this.focused);
        },

        inputAction: function (event) {
            this.value = event.target.value;

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
                        this.blur();
                    break;

                    // esc
                    case 27:
                        this.value = this.lastVal;
                        this.blur();
                    break;
                }
            // }
            event.stopPropagation();
        },
    });
})();
