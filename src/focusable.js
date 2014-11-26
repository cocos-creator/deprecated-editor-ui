var EditorUI;
(function (EditorUI) {

    //
    function _removeTabIndexRecursively ( el ) {
        if ( el.focused !== undefined && el._initTabIndex !== undefined ) {
            el.focused = false;
            el.removeAttribute('tabindex');
        }

        for ( var i = 0; i < el.childElementCount; ++i ) {
            _removeTabIndexRecursively ( el.children[i] );
        }
    }

    function _initTabIndexRecursively ( el ) {
        if ( el.focused !== undefined && el._initTabIndex !== undefined ) {
            if ( el.disabled === false ) {
                el._initTabIndex();
            }
        }

        for ( var i = 0; i < el.childElementCount; ++i ) {
            _initTabIndexRecursively ( el.children[i] );
        }
    }


    EditorUI.focusable = {
        publish: {
            focused: { value: false, reflect: true },
            disabled: { value: false, reflect: true },
        },

        observe: {
            focused: '_focusChanged',
            disabled: '_disabledChanged',
        },

        _init: function ( focusEls ) {
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
            for ( var i = 0; i < this.focusEls.length; ++i ) {
                var el = this.focusEls[i];
                el.tabIndex = EditorUI.getParentTabIndex(this) + 1;
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

        _focusChanged: function () {
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
    };
})(EditorUI || (EditorUI = {}));
