var EditorUI;
(function (EditorUI) {
    // DISABLE: use wrap, unwrap instead
    // EditorUI.getDOM = function ( domWrapper ) {
    //     if ( Platform.flags.shadow )
    //         return domWrapper.impl;
    //     else
    //         return domWrapper;
    // };

    EditorUI.isFlex = function ( element ) {
        if ( element.getAttribute("flex-1") !== null ) return true;
        if ( element.getAttribute("flex-2") !== null ) return true;
        if ( element.getAttribute("flex-3") !== null ) return true;
        if ( element.getAttribute("flex-4") !== null ) return true;
        if ( element.getAttribute("flex-5") !== null ) return true;
        if ( element.getAttribute("flex-6") !== null ) return true;
        if ( element.getAttribute("flex-7") !== null ) return true;
        if ( element.getAttribute("flex-8") !== null ) return true;
        if ( element.getAttribute("flex-9") !== null ) return true;
        if ( element.getAttribute("flex-10") !== null ) return true;
        if ( element.getAttribute("flex-11") !== null ) return true;
        if ( element.getAttribute("flex-12") !== null ) return true;

        return false;
    };

})(EditorUI || (EditorUI = {}));
