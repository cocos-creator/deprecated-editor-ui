EditorUI.focusable = (function () {

    //
    function _removeTabIndexRecursively ( el ) {
        if ( el.focused !== undefined && el.initTabIndex !== undefined ) {
            el.focused = false;
            el.removeTabIndex();
        }

        for ( var i = 0; i < el.childElementCount; ++i ) {
            _removeTabIndexRecursively ( el.children[i] );
        }
    }

    function _initTabIndexRecursively ( el ) {
        if ( el.focused !== undefined && el.initTabIndex !== undefined ) {
            if ( el.disabled === false ) {
                el.initTabIndex();
            }
        }

        for ( var i = 0; i < el.childElementCount; ++i ) {
            _initTabIndexRecursively ( el.children[i] );
        }
    }


    var focusable = {
        publish: {
            focused: { value: false, reflect: true },
            disabled: { value: false, reflect: true },
        },

        observe: {
            focused: '_focusedChanged',
            disabled: '_disabledChanged',
        },

        _initFocusable: function ( focusEls ) {
            if ( focusEls ) {
                if ( Array.isArray(focusEls) ) {
                    this.focusEls = focusEls;
                }
                else {
                    this.focusEls = [focusEls];
                }
            }
            else {
                this.focusEls = [];
            }

            this._initTabIndex();
        },

        _initTabIndex: function () {
            if ( !this.focusEls )
                return;

            for ( var i = 0; i < this.focusEls.length; ++i ) {
                var el = this.focusEls[i];
                el.tabIndex = EditorUI.getParentTabIndex(this) + 1;
            }
        },

        _removeTabIndex: function () {
            if ( !this.focusEls )
                return;

            for ( var i = 0; i < this.focusEls.length; ++i ) {
                var el = this.focusEls[i];
                // NOTE: this is better than el.removeAttribute('tabindex'),
                // because <input> only not get focused when tabIndex=-1
                el.tabIndex = -1;
            }
        },

        _disabledInHierarchy: function () {
            if ( this.disabled )
                return true;

            var parent = this.parentElement;
            while ( parent ) {
                if ( parent.disabled )
                    return true;

                parent = parent.parentElement;
            }
            return false;
        },

        _focusedChanged: function () {
            if ( this.disabled ) {
                this.focused = false;
            }
        },

        _disabledChanged: function () {
            if ( this.disabled ) {
                this.style.pointerEvents = 'none';
                _removeTabIndexRecursively(this);
            }
            else {
                this.style.pointerEvents = '';
                _initTabIndexRecursively(this);
            }
        },

        _focusAction: function ( event ) {
            this.focused = true;
        },

        _blurAction: function ( event ) {
            this.focused = false;
        },

        focus: function () {
            if ( this._disabledInHierarchy() )
                return;

            if ( this.focusEls.length > 0 ) {
                this.focusEls[0].focus();
            }
            this.focused = true;
        },

        blur: function () {
            if ( this._disabledInHierarchy() )
                return;

            if ( this.focusEls.length > 0 ) {
                this.focusEls[0].blur();
            }
            this.focused = false;
        },

        initTabIndex: function () {
            this._initTabIndex();
        },

        removeTabIndex: function () {
            this._removeTabIndex();
        },
    };
    return focusable;
})();
