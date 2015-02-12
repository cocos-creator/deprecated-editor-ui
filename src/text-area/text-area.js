Polymer(EditorUI.mixin({
    publish: {
        value: '',
    },

    ready: function() {
        this._initFocusable(this.$.inputArea);
    },

    valueChanged: function () {
        this.$.inputArea.value = this.value;
        this._adjust();
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
        this._focusAction();
    },

    blurAction: function (event, detail, sender) {
        if ( this.focused === false )
            return;

        this._blurAction();
    },

    inputAction: function (event) {
        this.value = event.target.value;
        EditorUI.fireChanged(this);

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
}, EditorUI.focusable));
