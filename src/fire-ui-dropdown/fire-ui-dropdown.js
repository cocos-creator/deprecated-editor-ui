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
		this._showOption = false;
		this.searchList = [];
	},

	showOption: function () {
		if ( this._showOption ) {
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

		document.body.appendChild(this.option);
		this.option.options = this.searchList;
		this._showOption = true;
	},

	hideOption: function () {
		this.option.style.display = "none";
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
			this.hideOption();
			return;
		}
		this.option.style.display = "";
		this.searchList = [];
		for (var i = 0; i < this.options.length; i++) {
			if (this.options[i].text.toUpperCase().indexOf(inputValue.toUpperCase()) > -1) {
				this.searchList.push(this.options[i]);
			}
		}
	},
});
