(function () {
    Polymer(EditorUI.mixin({
        publish: {
            value: '',
            placeholder: '',
        },

        ready: function() {
            this._initFocusable(this.$.inputArea);
        },

        valueChanged: function () {
            this.$.inputArea.value = this.value;
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

        select: function () {
            this.$.inputArea.select();
        },

        focusAction: function (event) {
            this._focusAction();
            this.lastVal = this.value;
        },

        blurAction: function (event, detail, sender) {
            if ( this.focused === false )
                return;

            if ( EditorUI.find( this.shadowRoot, event.relatedTarget ) )
                return;

            this._blurAction();

            //
            if ( this.value !== this.$.inputArea.value ) {
                this.value = this.$.inputArea.value;
                this.fire('changed');
            }

            this.fire('confirm');
        },

        inputAction: function (event) {
            // NOTE: this will prevent Chinese input
            // if ( this.value != event.target.value ) {
            //     console.log(event.target.value);
            //     this.value = event.target.value;
            //     this.fire('changed');
            // }
            event.stopPropagation();
        },

        inputMouseDownAction: function (event) {
            if ( !this.focused ) {
                event.preventDefault();
                event.stopPropagation();

                this.select();
            }
        },

        inputKeyDownAction: function (event) {
            switch ( event.which ) {
                // enter
                case 13:
                    if ( this.value != event.target.value ) {
                        this.value = event.target.value;
                        this.fire('changed');
                    }
                    this.$.inputArea.blur();
                break;

                // esc
                case 27:
                    this.$.inputArea.value = this.lastVal;
                    if ( this.value != this.lastVal ) {
                        this.value = this.lastVal;
                        this.fire('changed');
                    }
                    this.$.inputArea.blur();
                break;
            }

            event.stopPropagation();
        },
    }, EditorUI.focusable));
})();
