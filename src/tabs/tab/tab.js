Polymer({
    frameEL: null,

    publish: {
        warn: { value: false, reflect: true, },
    },

    ready: function () {
        this.setIcon(null);
    },

    _onDragStart: function ( event ) {
        event.stopPropagation();

        EditorUI.DockUtils.dragstart( event.dataTransfer, this );
    },

    _onClick: function ( event ) {
        event.stopPropagation();

        this.fire( 'tab-click', {} );
    },

    setIcon: function ( img ) {
        if ( img ) {
            this.$.icon.style.display = "inline";
            if ( this.$.icon.childElementCount > 0 ) {
                this.$.icon.removeChild(this.$.icon.firstChild);
            }
            this.$.icon.appendChild(img);
            img.setAttribute('draggable','false'); // this will prevent item dragging
        }
        else {
            this.$.icon.style.display = "none";
            if ( this.$.icon.childElementCount > 0 ) {
                this.$.icon.removeChild(this.$.icon.firstChild);
            }
        }
    },
});
