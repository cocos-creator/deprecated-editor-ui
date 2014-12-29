Polymer({
	publish: {
		options: []
	},

	observe: {
		searchList: "optionsChanged"
	},

	created: function () {
		this.option = new DropOption();
		this.option.owner = this;
		this.hide = false;
		this._showOption = false;
		this.searchList = [];
	},

	showOption: function () {
		window.requestAnimationFrame ( function () {
			if (this.hide) {
				return;
			}
			var bodyRect = document.body.getBoundingClientRect();
			var selectRect = this.getBoundingClientRect();
			var optionRect = this.getBoundingClientRect();

			this.option.style.width = optionRect.width - 2 + "px";
			this.option.style.left =  optionRect.left - bodyRect.left + "px";
			this.option.style.top = optionRect.top - bodyRect.top + optionRect.height - 2 + "px";
			this.option.style.position = "absolute";
			this.option.style.zIndex = 999;
			if ( !this._showOption ) {
				document.body.appendChild(this.option);
			}
			this.option.options = this.searchList;
			this._showOption = true;
			this.showOption();
		}.bind(this));
	},

	hideMenu: function () {
		this.option.style.display = "none";
		this.hide = true;
	},

	showMenu: function () {
		this.option.style.display = "";
		this.hide = false;
	},

	optionsChanged: function () {
		this.option.options = this.searchList;
	},

	inputAction: function () {
		this.searchValue();
		this.showOption();
	},

	keydownAction: function (event) {
		this.option.pressKey(event.which);
	},

	searchValue: function () {
		var inputValue = this.$.input.value;
		this.searchList = [];
		if (inputValue === "") {
			this.hideMenu();
			return;
		}
		this.showMenu();
		this.searchList = [];
		for (var i = 0; i < this.options.length; i++) {
			if (this.options[i].text.toUpperCase().indexOf(inputValue.toUpperCase()) > -1) {
				this.searchList.push(this.options[i]);
			}
		}
	},
});
