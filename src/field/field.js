(function () {
    Polymer('fire-ui-field', {

        ready: function () {
            if ( this.name === null ) {
                var varName = this.attributes.value.value;
                varName = varName.replace( /{{(.*)}}/, "$1" );
                this.name = FIRE.camelCaseToHuman(varName); 
            }

            // do dom transform
            var typename = typeof this.value;
            var fieldEL = null;

            switch ( typename ) {
                case "number":
                    if ( this.type === 'enum' ) {
                        if ( this.enumType !== undefined && this.enumType !== '' ) {
                            var enumTypeDef = FIRE.getVarFrom(window,this.enumType);
                            this.finalEnumList = FIRE.getEnumList(enumTypeDef);
                        }
                        else {
                            this.finalEnumList = this.enumList.slice(0);
                        }
                        fieldEL = new FireSelect(); 
                        fieldEL.bind( 'value',  new PathObserver(this,'value') );
                        fieldEL.options = this.finalEnumList;
                    }
                    else if ( this.type === 'int' ) {
                        fieldEL = new FireUnitInput();
                        fieldEL.bind( 'value',  new PathObserver(this,'value') );
                        fieldEL.type = 'int';
                    }
                    else if ( this.type === 'float' ) {
                        fieldEL = new FireUnitInput();
                        fieldEL.bind( 'value',  new PathObserver(this,'value') );
                        fieldEL.type = 'float';
                    }
                    break;

                case "boolean":
                    fieldEL = new FireCheckbox();
                    fieldEL.bind( 'checked',  new PathObserver(this,'value') );
                    break;

                // case "string":
                //     if ( this.textMode === 'single' ) {
                //         labelEL = compileLabelEL(this,'flex-1');
                //         fieldEL = $compile( "<fire-ui-text-input class='flex-2' fi-bind='bind'></fire-ui-text-input>" )( this );
                //     }
                //     else if ( this.textMode === 'multi' ) {
                //         labelEL = compileLabelEL(this,'flex-1 flex-align-self-start');
                //         fieldEL = $compile( "<fire-ui-text-area class='flex-2' fi-bind='bind'></fire-ui-text-area>" )( this );
                //     }
                //     break;

                // case "object":
                //     if ( Array.isArray(this.bind) ) {
                //         // TODO
                //     }
                //     else {
                //         var className = FIRE.getClassName(this.bind);
                //         switch ( className ) {
                //             case "FIRE.Color":
                //                 labelEL = compileLabelEL(this,'flex-1');
                //                 fieldEL = $compile( "<fire-ui-color class='flex-2' fi-bind='bind'></fire-ui-color>" )( this );
                //                 break;

                //             case "FIRE.Vec2":
                //                 labelEL = compileLabelEL(this,'flex-1');
                //                 fieldEL = $compile( "<fire-ui-vec2 class='flex-2' fi-bind='bind'></fire-ui-vec2>" )( this );
                //                 break;
                //         }
                //     }
                //     break;
            }

            fieldEL.classList.add('flex-2');
            this.shadowRoot.appendChild(fieldEL);
        },
    });
})();
