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

    var _findInChildren = function ( element, elementToFind ) {
        for ( var i = 0; i < element.children.length; ++i ) {
            var childEL = element.children[i];
            if ( childEL === elementToFind )
                return true;

            if ( childEL.children.length > 0 )
                if ( _findInChildren( childEL, elementToFind ) )
                    return true;
        }
        return false;
    };

    //
    EditorUI.find = function ( elements, elementToFind ) {
        if ( Array.isArray(elements) || 
             elements instanceof NodeList ||
             elements instanceof HTMLCollection ) 
        {
            for ( var i = 0; i < elements.length; ++i ) {
                var element = elements[i];
                if ( element === elementToFind )
                    return true;

                if ( _findInChildren ( element, elementToFind ) )
                    return true;
            }
            return false;
        }

        // if this is a single element
        if ( elements === elementToFind )
            return true;

        return _findInChildren( elements, elementToFind );
    };

    //
    EditorUI.getParentTabIndex = function ( element ) {
        var parent = element.parentElement;
        while ( parent ) {
            if ( parent.tabIndex !== null && 
                 parent.tabIndex !== undefined &&
                 parent.tabIndex !== -1 )
                return parent.tabIndex;

            parent = parent.parentElement;
        }
        return 0;
    };

    //
    EditorUI.getFirstFocusableChild = function ( element ) {
        if ( element.tabIndex !== null && 
             element.tabIndex !== undefined &&
             element.tabIndex !== -1 )
        {
            return element;
        }

        var el = null;
        for ( var i = 0; i < element.children.length; ++i ) {
            el = EditorUI.getFirstFocusableChild(element.children[i]);
            if ( el !== null )
                return el;
        }
        if ( element.shadowRoot ) {
            el = EditorUI.getFirstFocusableChild(element.shadowRoot);
            if ( el !== null )
                return el;
        }

        return null;
    };

    //
    var _dragGhost = null; 
    EditorUI.addDragGhost = function ( cursor ) {
        // add drag-ghost
        if ( _dragGhost === null ) {
            _dragGhost = document.createElement('div');
            _dragGhost.classList.add('drag-ghost');
            _dragGhost.style.position = 'fixed';
            _dragGhost.style.zIndex = '999';
            _dragGhost.style.left = '0';
            _dragGhost.style.top = '0';
            _dragGhost.style.width = window.innerWidth + 'px';
            _dragGhost.style.height = window.innerHeight + 'px';
            _dragGhost.oncontextmenu = function() { return false; };
        }
        _dragGhost.style.cursor = cursor;
        document.body.appendChild(_dragGhost);
    };

    EditorUI.removeDragGhost = function () {
        if ( _dragGhost !== null ) {
            _dragGhost.style.cursor = 'auto';
            if ( _dragGhost.parentNode !== null ) {
                _dragGhost.parentNode.removeChild(_dragGhost);
            }
        }
    };

})(EditorUI || (EditorUI = {}));
