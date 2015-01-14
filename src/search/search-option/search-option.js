Polymer({
	publish: {
		options: [],
        above: {
            value: false,
            reflect: true
        },
	},

    created: function () {
        this.owner = null;
    },

    applyFilter: function ( options, searchText ) {
        var i = 0;
        return options.filter( function ( item ) {
            return item.toLowerCase().indexOf(searchText) !== -1;
        });
    },

	// pressKey: function (keyCode) {
	//     var thisRect = this.getBoundingClientRect();
    //     var optionRect;
	//     if (keyCode == 38) {
	//         if (this.tempSelect.previousElementSibling !== null) {
	//             this.tempSelect.removeAttribute("select");
	//             this.tempSelect.previousElementSibling.setAttribute("select","");
	//             this.tempSelect = this.tempSelect.previousElementSibling;
	//             optionRect = this.tempSelect.getBoundingClientRect();
	//             if (optionRect.top <= thisRect.top - 15) {
	//                 this.$.data.scrollTop -= optionRect.height + 1;
	//             }
	//         }
	//     }
	//     else if (keyCode == 40) {
	//         if (this.tempSelect.nextElementSibling !== null) {
	//             this.tempSelect.removeAttribute("select");
	//             this.tempSelect.nextElementSibling.setAttribute("select","");
	//             this.tempSelect = this.tempSelect.nextElementSibling;
	//             optionRect = this.tempSelect.getBoundingClientRect();
	//             if (optionRect.top >= (thisRect.top + thisRect.height) - 15) {
	//                 this.$.data.scrollTop += optionRect.height + 1;
	//             }
	//         }
	//     }
	//     else if (keyCode == 13) {
	//         this.owner.select = this.tempSelect.value;
	//         this.owner.hideMenu();
	//     }
	// },

	// selectChanged: function () {
	//     this.owner.select = this.tempSelect.value;
	//     this.owner.value = this.options[this.tempSelect.value];
	// },
});
