(function () {
    Polymer({
        publish: {
            value: '',
            multiline: false,
            focused: {
                value: false,
                reflect: true
            },
        },

        ready: function() {
            this.$.inputArea.tabIndex = EditorUI.getParentTabIndex(this)+1;
        },

        valueChanged: function () {
            this.$.inputArea.value = this.value;
            this.fire('changed');

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

        focus: function () {
            this.$.inputArea.focus();
        },

        blur: function () {
            this.$.inputArea.blur();
        },

        select: function () {
            this.$.inputArea.select();
        },

        focusAction: function (event) {
            this.lastVal = this.value;
            this.focused = true;
        },

        blurAction: function (event, detail, sender) {
            if ( this.focused === false )
                return;

            if ( EditorUI.find( this.shadowRoot, event.relatedTarget ) )
                return;

            //
            if ( this.value !== this.$.inputArea.value ) {
                this.value = this.$.inputArea.value;
            }
            this.focused = false;
            this.fire('confirm');
        },

        inputAction: function (event) {
            // NOTE: this will prevent Chinese input
            // if ( this.value != event.target.value ) {
            //     this.value = event.target.value;
            // }

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
                        if ( this.value != event.target.value ) {
                            this.value = event.target.value;
                        }
                        this.$.inputArea.blur();
                    break;

                    // esc
                    case 27:
                        this.$.inputArea.value = this.lastVal;
                        if ( this.value != this.lastVal ) {
                            this.value = this.lastVal;
                        }
                        this.$.inputArea.blur();
                    break;
                }
            // }
            event.stopPropagation();
        },
    });
})();
