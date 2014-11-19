(function () {
    Polymer({
        publish: {
            value: '',
            focused: {
                value: false,
                reflect: true
            },
            disabled: {
                value: false,
                reflect: true
            }
        },

        observe:{
            'disabled' : 'disabledChanged',
        },

        ready: function() {
            this.$.inputArea.tabIndex = EditorUI.getParentTabIndex(this)+1;
        },

        valueChanged: function () {
            this.$.inputArea.value = this.value;
            this._adjust();
        },

        disabledChanged: function () {
            if (this.isDisabled()) {
                this.$.inputArea.setAttribute('disabled','');
            }else{
                this.$.inputArea.removeAttribute('disabled');
            }
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

            if ( EditorUI.find( this.shadowRoot, event.relatedTarget ) )
                return;

            this.focused = false;
        },

        inputAction: function (event) {
            this.value = event.target.value;
            this.fire('changed');

            event.stopPropagation();
        },

        inputClickAction: function (event) {
            event.stopPropagation();
        },

        inputKeyDownAction: function (event) {
            switch ( event.which ) {
                // NOTE: enter will be used as new-line, ESC here will be confirm behavior
                // NOTE: textarea already have ctrl-z undo behavior
                // esc
                case 27:
                    this.$.inputArea.blur();
                return false;
            }
            event.stopPropagation();
        },
        isDisabled: function(){
            if ( this.disabled )
                return true;

            var parent = this.parentElement;
            while ( parent ) {
                
                if( parent.disabled )
                    return true;

                parent = parent.parentElement;
            }
            return false;
        },
    });
})();
