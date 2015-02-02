Polymer({
    publish: {
        value: null,
    },

    domReady: function () {
        var klass = this.value.constructor;
        if (klass.__props__) {
            for (var p = 0; p < klass.__props__.length; p++) {
                var propName = klass.__props__[p];
                var attrs = Fire.attr(klass, propName);

                // skip hide-in-inspector
                if ( attrs.hideInInspector ) {
                    continue;
                }

                var propEL = new FireProp();
                propEL.initWithAttrs(this.value, propName, attrs);

                this.shadowRoot.appendChild(propEL);
            }
        }
        else {
            // TODO:
        }
    },
});
