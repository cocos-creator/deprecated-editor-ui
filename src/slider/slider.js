Polymer(EditorUI.mixin({
    _editing: false,

    publish: {
        value: 0.0,
        type: 'float', // int, float // TODO: not implemented
        min: 0.0,
        max: 1.0,
        interval: null, // TODO: not implemented
    },

    observe: {
        'value': 'updateValue',
        'min': '_updateMinMax',
        'max': '_updateMinMax',
    },

    ready: function () {
        this._initFocusable(this.$.focus);

        this._ready = true;
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
                break;

            case 'float':
                this._min = (this.min!==null) ? parseFloat(this.min) : -Number.MAX_VALUE;
                this._max = (this.max!==null) ? parseFloat(this.max) : Number.MAX_VALUE;
                break;
        }

        this.$.input.setRange( this.min, this.max );
        this.updateValue();
    },

    updateValue: function () {
        if ( this._editing )
            return;

        this.value = Math.clamp(this.value, this._min, this._max);
        var ratio = (this.value-this._min)/(this._max-this._min);
        this.$.nubbin.style.left = ratio * 100 + "%";

        this.$.input.value = this.value;
    },

    inputChangedAction: function ( event ) {
        event.stopPropagation();
        this.value = event.target.value;
    },

    mousedownAction: function (event) {
        EditorUI.addDragGhost("pointer");
        this._editing = true;

        var rect = this.$.track.getBoundingClientRect();
        var mouseDownX = rect.left;

        //
        var updateMouseMove = function (event) {
            var offsetX = (event.clientX - mouseDownX)/this.$.track.clientWidth;

            offsetX = Math.max( Math.min( offsetX, 1.0 ), 0.0 );
            this.$.nubbin.style.left = offsetX * 100 + "%";
            this.value = this._min + offsetX * (this._max-this._min);
            this.$.input.value = this.value;
            EditorUI.fireChanged(this);

            event.stopPropagation();
        };
        updateMouseMove.call(this,event);


        var mouseMoveHandle = updateMouseMove.bind(this);
        var mouseUpHandle = (function(event) {
            document.removeEventListener('mousemove', mouseMoveHandle);
            document.removeEventListener('mouseup', mouseUpHandle);

            EditorUI.removeDragGhost();
            this._editing = false;
            event.stopPropagation();
        }).bind(this);
        document.addEventListener ( 'mousemove', mouseMoveHandle );
        document.addEventListener ( 'mouseup', mouseUpHandle );
    },
}, EditorUI.focusable));
