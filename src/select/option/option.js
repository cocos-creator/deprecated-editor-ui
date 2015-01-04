(function () {
    Polymer(EditorUI.mixin({
        publish: {
            value: -1,
            options: [],
            above: {
                value: false,
                reflect: true
            },
            dropdown: {
                value: false,
                reflect: true
            },
            searchValue: '',
            owner: null,
            hide: 'hide',
        },

        domReady: function () {
            this.tempOption = this.options;
        },

        observe: {
            searchValue: 'searchValueChanged',
            tempOption: 'isEmpty',
        },

        clickAction: function (event, detail, sender) {
            var idx = parseInt(sender.getAttribute('index'));
            var entry = this.tempOption[idx];
            this.owner.tempoption = this.tempOption;
            this.owner.value = this.value;
            if ( this.value !== entry.value ) {
                this.value = entry.value;
                if ( this.owner )
                    this.owner.fire('changed');
            }

            if ( this.owner ) {
                this.owner.fire('select', this.value);
            }

            this.owner.focus();
            event.stopPropagation();
        },

        isEmpty: function () {
            if (this.tempOption.length <= 0) {
                this.hide = "";
            }else{
                this.hide = "hide";
            }
        },

        inputBlur: function (event) {
            if (event.relatedTarget === null) {
                this.owner.showOption(false);
                this.owner.blur();
            }
        },

        unitClickAction: function () {
            this.$.searchinput.focus();
        },

        searchValueChanged: function () {
            this.tempOption = [];
            for (var i = 0; i < this.options.length; i++) {
                if (this.options[i].name.toUpperCase().indexOf(this.searchValue.toUpperCase()) > -1) {
                    this.tempOption.push(this.options[i]);
                }
            }
        },

    }, EditorUI.focusable));
})();
