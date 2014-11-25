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
            disabled: '_disabledChanged',
        },

        _initTabIndex: function () {
            this.tabIndex = EditorUI.getParentTabIndex(this) + 1;
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
