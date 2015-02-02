Polymer({
    publish: {
        value: null,
    },

    domReady: function () {
        var klass = this.value.constructor;
        var propEL = null;

        if (klass.__props__) {
            for ( var i = 0; i < klass.__props__.length; ++i ) {
                var propName = klass.__props__[i];
                var attrs = Fire.attr(klass, propName);

                // skip hide-in-inspector
                if ( attrs.hideInInspector ) {
                    continue;
                }

                propEL = new FireProp();
                propEL.initWithAttrs(this.value, propName, attrs);

                this.shadowRoot.appendChild(propEL);
            }
        }
        else {
            for ( var p in this.value ) {
                if ( !this.value.hasOwnProperty(p) ) {
                    continue;
                }

                propEL = new FireProp();
                propEL.name = EditorUI.camelCaseToHuman(p);
                propEL.bind( 'value', new Fire._PathObserver( this.value, p ) );

                this.shadowRoot.appendChild(propEL);
            }
        }
    },
});
