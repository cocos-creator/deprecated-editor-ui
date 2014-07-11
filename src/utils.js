var PolymerUtils;
(function (PolymerUtils) {
    PolymerUtils.getDOM = function ( domWrapper ) {
        if ( Platform.flags.shadow )
            return domWrapper.impl;
        else
            return domWrapper;
    };

})(PolymerUtils || (PolymerUtils = {}));
