Polymer(EditorUI.mixin({
    publish: {
        value: null,
        unit: '',
        type: 'float', // int, float
        min: null,
        max: null,
        interval: null,
        precision: 2,
    },

    created: function () {
        this.holdingID = null;
        this.timeoutID = null;
        this._editing = false;
    },

    ready: function() {
        this._initFocusable(this.$.input);
        this._updateMinMax();
    },

    setRange: function ( min, max ) {
        this.min = min;
        this.max = max;
        this._updateMinMax();
    },

    _updateMinMax: function () {
        switch ( this.type ) {
            case 'int':
                this._min = (this.min!==null) ? parseInt(this.min) : Number.NEGATIVE_INFINITY;
                this._max = (this.max!==null) ? parseInt(this.max) : Number.POSITIVE_INFINITY;
                this._interval = (this.interval!==null) ? this.interval : 1;
                break;

            case 'float':
                this._min = (this.min!==null) ? parseFloat(this.min) : -Number.MAX_VALUE;
                this._max = (this.max!==null) ? parseFloat(this.max) : Number.MAX_VALUE;
                this._interval = (this.interval!==null) ? this.interval : 1/Math.pow(10,this.precision);
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
                val = parseFloat(parseFloat(val).toFixed(this.precision));
                if ( isNaN(val) )
                    val = 0;
                val = Math.min( Math.max( val, this._min ), this._max );
                return val;
        }

        Fire.log("can't find proper type for " + this.type);
        return val;
    },

    _increase: function () {
        var val = this._convert(this.value + this._interval);

        if ( this.value != val ) {
            this.value = val;
            EditorUI.fireChanged(this);
        }

        // NOTE: we have to manually call this,
        // because this._editing is true when this function invoked.
        this.$.input.value = val;
    },

    _decrease: function () {
        var val = this._convert(this.value - this._interval);

        if ( this.value != val ) {
            this.value = val;
            EditorUI.fireChanged(this);
        }

        // NOTE: we have to manually call this,
        // because this._editing is true when this function invoked.
        this.$.input.value = val;
    },

    _clearHover: function () {
        clearInterval(this.holdingID);
        this.holdingID = null;

        clearTimeout(this.timeoutID);
        this.timeoutID = null;
    },

    valueChanged: function () {
        if ( this._editing )
            return;

        this.$.input.value = this._convert(this.value);
    },

    minChanged: function () {
        this._updateMinMax();
    },

    maxChanged: function () {
        this._updateMinMax();
    },

    focusAction: function (event) {
        this._focusAction();
        this.lastVal = this._convert(this.value);
        this._editing = true;
    },

    blurAction: function (event, detail, sender) {
        if ( this.focused === false )
            return;

        if ( EditorUI.find( this.shadowRoot, event.relatedTarget ) )
            return;

        this._blurAction();
        this._editing = false;

        var val = this._convert(this.$.input.value);
        if ( this.value !== val ) {
            this.value = val;
            EditorUI.fireChanged(this);
        }
        // NOTE: we set the input.value because this.value may not changed after invalid inputs
        this.$.input.value = val;

        this.fire('confirm');
    },

    inputAction: function (event) {
        var val = this._convert(event.target.value);
        if ( this.value !== val ) {
            this.value = val;
            EditorUI.fireChanged(this);
        }

        event.stopPropagation();
    },

    inputKeydownAction: function (event) {
        switch ( event.which ) {
            // enter
            case 13:
                this.$.input.blur();
            break;

            // esc
            case 27:
                // NOTE: we set the input.value because value depends on _convert(input.value)
                this.$.input.value = this.lastVal;
                if ( this.value !== this.lastVal ) {
                    this.value = this.lastVal;
                    EditorUI.fireChanged(this);
                }
                this.$.input.blur();
            break;
        }
        event.stopPropagation();
    },

    unitClickAction: function (event) {
        this.$.input.focus();
        event.stopPropagation();
    },

    increaseAction: function (event) {
        if (event.which !== 1)
            return;

        event.stopPropagation();
        this.$.input.focus();

        this._increase();
    },

    increaseHoldAction: function (event) {
        if (event.which !== 1)
            return;

        event.stopPropagation();
        this.$.input.focus();

        this.timeoutID = setTimeout( function () {
            this.holdingID = setInterval( function () {
                this._increase();
            }.bind(this), 50);
        }.bind(this), 500 );
    },

    decreaseHoldAction: function (event) {
        if (event.which !== 1)
            return;

        event.stopPropagation();
        this.$.input.focus();

        this.timeoutID = setTimeout( function () {
            this.holdingID = setInterval( function () {
                this._decrease();
            }.bind(this), 100);
        }.bind(this), 500 );
    },

    decreaseAction: function (event) {
        if (event.which !== 1)
            return;

        event.stopPropagation();
        this.$.input.focus();

        this._decrease();
    },

    mouseupAction: function (event) {
        if (event.which !== 1)
            return;

        event.stopPropagation();
        this.$.input.focus();

        this._clearHover();
    },

    mouseoutAction: function (event) {
        if (event.which !== 1)
            return;

        if (this.holdingID === null)
            return;

        event.stopPropagation();
        this.$.input.focus();

        this._clearHover();
    },

}, EditorUI.focusable));
