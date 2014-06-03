(function () {
    Polymer('fire-ui-unitinput', {
        ready: function() {
            this.focused = false;
            this.type = this.type ? this.type : 'int';
            this.unit = this.unit ? this.unit : '';
        },

        _convert: function ( val ) {
            switch ( this.type ) {
                case 'int': 
                    val = parseInt(val);
                if ( isNaN(val) ) 
                    val = 0;
                return val;

                case 'float': 
                    val = parseFloat(val);
                if ( isNaN(val) ) 
                    val = 0;
                return val;
            }
            console.log("can't find proper type for " + this.type);
            return val;
        },

        onFocusIn: function () {
            this.lastVal = this.value;
            this.focused = true;
        },

        onFocusOut: function () {
            if ( this.value !== this.lastVal ) {
                this.value = this._convert(this.value);
            }
            this.focused = false;
        },

        onInput: function (event) {
            this.value = this._convert(event.target.value);
        },

        onInputClick: function (event) {
            event.target.select();
        },

        onInputKeyDown: function (event) {
            switch ( event.which ) {
                // enter
                case 13:
                    event.target.blur(); 
                break;

                // esc
                case 27:
                    this.value = this._convert(this.lastVal);
                    event.target.blur(); 
                break;
            }
        },

        onIncrease: function () {
            this.value = this._convert(this.value+1);
        },

        onDecrease: function () {
            this.value = this._convert(this.value-1);
        },
    });
})();
