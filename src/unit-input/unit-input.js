(function () {
    Polymer('fire-ui-unit-input', {
        focused: false,
        type: 'int',
        unit: '',
        precision: '2',
        value: '',

        ready: function() {
            this.$.input.tabIndex = FIRE.getParentTabIndex(this)+1;
            this._precision = parseInt(this.precision);

            switch ( this.type ) {
                case 'int': 
                    this._min = (this.min!==null) ? parseInt(this.min) : Number.NEGATIVE_INFINITY;
                    this._max = (this.max!==null) ? parseInt(this.max) : Number.POSITIVE_INFINITY;
                    this._interval = (this.interval!==null) ? parseInt(this.interval) : 1;
                    break;

                case 'float':
                    this._min = (this.min!==null) ? parseFloat(this.min) : -Number.MAX_VALUE;
                    this._max = (this.max!==null) ? parseFloat(this.max) : Number.MAX_VALUE;
                    this._interval = (this.interval!==null) ? parseFloat(this.interval) : 1/Math.pow(10,this._precision);
                    break;
            }
        },

        _convert: function ( val ) {
            switch ( this.type ) {
                case 'int': 
                    val = parseInt(val);
                    if ( isNaN(val) ) 
                        val = 0;
                    val = Math.min( Math.max( val, this._min ), this._max );
                    return val;

                case 'float': 
                    val = parseFloat(parseFloat(val).toFixed(this._precision));
                    if ( isNaN(val) ) 
                        val = 0;
                    val = Math.min( Math.max( val, this._min ), this._max );
                    return val;
            }

            console.log("can't find proper type for " + this.type);
            return val;
        },

        valueChanged: function () {
            this.$.input.value = this._convert(this.value);
        },

        focusAction: function (event) {
            this.lastVal = this._convert(this.value);
            this.focused = true;
            this.classList.toggle('focused', this.focused);
        },

        blurAction: function (event) {
            if ( this.focused ) {
                var val = this._convert(this.$.input.value);
                this.value = val;
                this.$.input.value = val;

                this.focused = false;
                this.classList.toggle('focused', this.focused);
            }
        },

        inputAction: function (event) {
            if ( event.target.value === "-" ) {
                return;
            }
            if ( event.target.value === "." ) {
                event.target.value = "0.";
                return;
            }
            if ( event.target.value === "-." ) {
                event.target.value = "-0.";
                return;
            }
            this.value = this._convert(event.target.value);

            event.stopPropagation();
        },

        inputClickAction: function (event) {
            event.stopPropagation();
        },

        inputKeyDownAction: function (event) {
            switch ( event.which ) {
                // enter
                case 13:
                    this.blur();
                break;

                // esc
                case 27:
                    this.$.input.value = this.lastVal;
                    this.blur();
                break;
            }
            event.stopPropagation();
        },

        unitClickAction: function (event) {
            this.$.input.focus();
            event.stopPropagation();
        },

        increaseAction: function (event) {
            this.value = this._convert(this.value+this._interval);
            event.stopPropagation();
        },

        decreaseAction: function (event) {
            this.value = this._convert(this.value-this._interval);
            event.stopPropagation();
        },
    });
})();
