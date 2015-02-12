Polymer(EditorUI.mixin({
    publish: {
        value: -1,
        options: [],
        searchable: {
            value: false,
            reflect: true
        },
    },

    observe: {
        value: 'updateValueName',
        focused: 'focusedChanged'
    },

    created: function () {
        this._showMenu = false;
        this.menu = null;
    },

    ready: function () {
        this._initFocusable(this.$.focus);
    },

    showOption: function ( show ) {
        if ( this._showMenu === show )
            return;

        this._showMenu = show;

        if ( show ) {
            if ( !this.menu ) {
                this.menu = new FireOption();
                this.menu.owner = this;
                this.menu.bind( 'value', new PathObserver(this,'value') );
            }

            document.body.appendChild(this.menu);

            this.menu.value = this.value;
            this.menu.options = this.options;
            this.menu.searchable = this.searchable;
            this.menu.searchValue = ""; // clear last search value
            this.menu.style.display = "";
            EditorUI.addHitGhost('cursor', '998', function () {
                this.showOption(false);
                this.focus();
            }.bind(this));
            this.updateMenu();
        }
        else {
            if ( this.menu ) {
                EditorUI.removeHitGhost();

                this.menu.style.display = "none";
                // NOTE: must save in shadowRoot, otherwise getFirstFocusableChild not working
                this.shadowRoot.appendChild(this.menu);
            }
        }
    },

    updateMenu: function () {
        window.requestAnimationFrame ( function () {
            if ( !this.menu || !this._showMenu )
                return;

            var bodyRect = document.body.getBoundingClientRect();
            var selectRect = this.getBoundingClientRect();
            var menuRect = this.menu.getBoundingClientRect();

            var style = this.menu.style;
            style.position = "absolute";
            style.width = selectRect.width + "px";
            style.left = (selectRect.left - bodyRect.left) + "px";
            style.zIndex = 999;

            if ( document.body.clientHeight - selectRect.bottom <= menuRect.height + 10 ) {
                style.top = (selectRect.top - bodyRect.top - menuRect.height + 2) + "px";
                this.menu.above = true;
            }
            else {
                style.top = (selectRect.bottom - bodyRect.top - 2) + "px";
                this.menu.above = false;
            }

            this.updateMenu();
        }.bind(this) );
    },

    updateValueName: function () {
        if ( this.value == -1 )
            return;

        for ( var i = 0; i < this.options.length; ++i ) {
            var entry = this.options[i];
            if ( entry.value === this.value ) {
                this.valueName = entry.name;
                break;
            }
        }
    },

    setValue: function ( val ) {
        this.value = val;
        EditorUI.fireChanged(this);
    },

    clickAction: function (event) {
        this.showOption( !this._showMenu );
        event.stopPropagation();
    },

    blurAction: function (event) {
        if ( this.focused === false ) {
            return;
        }

        if ( this.menu && this.menu === event.relatedTarget ) {
            return;
        }

        this._blurAction();
        this.showOption(false);
    },

    keydownAction: function (event) {
        switch ( event.which ) {
            // esc
            case 27:
                this.showOption(false);
                event.stopPropagation();
            break;
        }
    },

    selectAction: function (event) {
        event.stopPropagation();

        this.showOption(false);
    },
}, EditorUI.focusable));
