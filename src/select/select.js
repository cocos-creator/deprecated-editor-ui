(function () {
    Polymer({
        publish: {
            value: -1,
            bodytop: 0,
            bodyHeight: 0,
            options: null,
            focused: {
                value: false,
                reflect: true
            },
        },

        observe: {
            value: 'updateValueName',
        },

        created: function () {
            this.showMenu = false;
        },

        ready: function () {
            this.$.focus.tabIndex = EditorUI.getParentTabIndex(this)+1;
        },

        domReady: function () {

            this.clientWidth =  document.body.clientWidth;

        },

        clickAction: function (event) {
            this.bodyHeight = document.body.scrollHeight;
            this.bodytop = this.getBoundingClientRect().top;
            if ( this.bodyHeight - this.bodytop<=200) {
                this.$.menu.style.marginTop=-(this.$.menu.scrollHeight+26);
            }
            
            this.showMenu = !this.showMenu;

            this.$.focus.focus();
            event.stopPropagation();
        },

        focusAction: function (event) {
            this.focused = true;
        },

        blurAction: function (event) {
            if ( this.focused === false )
                return;

            if ( EditorUI.find( this.shadowRoot, event.relatedTarget ) )
                return;

            this.showMenu = false;
            this.focused = false;
        },

        keyDownAction: function (event) {
            switch ( event.which ) {
                // esc
                case 27:
                    this.$.focus.blur();
                    event.stopPropagation();
                break;
            }
        },

        selectAction: function (event, detail, sender) {
            var idx = parseInt(sender.getAttribute('index'));
            var entry = this.options[idx];
            if ( this.value !== entry.value ) {
                this.value = entry.value;
                this.fire('changed');
            }
            this.showMenu = false;

            event.stopPropagation();
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
    });
})();
