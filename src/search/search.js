Polymer(EditorUI.mixin({
    publish: {
        options: [],
        placeholder: 'Search',
    },

    ready: function () {
        this._initFocusable( this.$.inputArea );
    },

    showOption: function ( show ) {
        if ( this._showMenu === show )
            return;

        this._showMenu = show;
        if ( this._showMenu ) {
            if ( !this.menu ) {
                this.menu = new FireSearchOption();
                this.menu.owner = this;
                this.menu.bind( 'options', new PathObserver(this,'options') );
            }

            document.body.appendChild(this.menu);

            this.menu.style.display = "";
            this.updateMenu();
        }
        else {
            if ( this.menu ) {
                this.menu.style.display = "none";
                this.appendChild(this.menu);
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

    inputAction: function (event) {
        event.stopPropagation();

        this.showOption(true);
        this.menu.searchText = this.$.inputArea.value;
    },

    inputKeyDownAction: function (event) {
        switch ( event.which ) {
            // enter
            case 13:
                this.$.inputArea.blur();
            break;

            // esc
            case 27:
                if ( this.$.inputArea.value !== "" ) {
                    this.$.inputArea.value = "";
                    this.menu.searchText = this.$.inputArea.value;
                }
                else {
                    this.$.inputArea.blur();
                }
            break;
        }

        event.stopPropagation();
    },

    iconClickAction: function ( event ) {
        event.stopPropagation();
        event.preventDefault();

        this.focus();
    },

    focusAction: function (event) {
        this._focusAction();
    },

    blurAction: function (event) {
        if ( this.focused === false )
            return;

        if ( EditorUI.find( this.shadowRoot, event.relatedTarget ) )
            return;

        this._blurAction();
        this.showOption(false);
    },

}, EditorUI.focusable));
