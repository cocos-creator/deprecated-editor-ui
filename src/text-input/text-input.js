(function () {
    Polymer(EditorUI.mixin({
        publish: {
            value: '',
            inputValue: '',
            placeholder: '',
            regex: {
                value: false,
                reflect: true
            }
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

        regexCheck: function (regex) {
            var input = regex;
            try{
                new RegExp(input);
                this.removeAttribute("error");
            }catch(e){
                this.$.inputArea.animate([
                    { background: "red", transform: "scale(1)" },
                    { background: "rgb(255,200,200)", transform: "scale(1)" },
                    { background: "red", transform: "scale(1)" },
                    { background: "rgb(255,200,200)", transform: "scale(1)" }
                    ], {
                        duration: 400
                });
                this.setAttribute("error","");
            }
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
            // DISABLE 1: this will prevent Chinese input
            // if ( this.value != event.target.value ) {
            //     this.value = event.target.value;
            //     this.fire('changed');
            // }

            // DISABLE 2:
            // this.fire('input-changed', { value: event.target.value } );
            if (this.regex) {
                this.regexCheck(event.target.value);
            }

            event.stopPropagation();
            this.inputValue = event.target.value;
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
