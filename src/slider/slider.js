(function () {
    Polymer({
        _editing: false,

        publish: {
            value: 0.0,
            min: 0.0,
            max: 1.0,
            focused: {
                value: false,
                reflect: true
            },
            disabled: {
                value: false,
                reflect: true
            }
        },

        observe: {
            'value': 'update',
        },

        ready: function () {
            this.$.focus.tabIndex = EditorUI.getParentTabIndex(this)+1;
        },

        update: function () {
            if ( this._editing )
                return;

            var ratio = this.value/(this.max-this.min);
            this.$.nubbin.style.left = ratio * 100 + "%";
        },

        focusAction: function (event) {
            if ( this.isDisabled() )
                return;

            this.focused = true;
        },

        blurAction: function (event) {
            if ( this.focused === false )
                return;

            if ( EditorUI.find( this.shadowRoot, event.relatedTarget ) )
                return;

            this.focused = false;
        },

        mousedownAction: function (event) {
            if ( this.isDisabled() )
                return;

            EditorUI.addDragGhost("pointer");
            this._editing = true;

            var rect = this.$.track.getBoundingClientRect();
            var mouseDownX = rect.left;

            //
            var updateMouseMove = function (event) {
                var offsetX = (event.clientX - mouseDownX)/this.$.track.clientWidth;

                offsetX = Math.max( Math.min( offsetX, 1.0 ), 0.0 );
                this.$.nubbin.style.left = offsetX * 100 + "%";
                this.value = this.min + offsetX * (this.max-this.min);
                this.fire('changed');

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

        isDisabled: function(){
            if ( this.disabled )
                return true;

            var parent = this.parentElement;
            while ( parent ) {
                if( parent.disabled )
                    return true;
                    
                parent = parent.parentElement;
            }
            return false;
        },
    });
})();
