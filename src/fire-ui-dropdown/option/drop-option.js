Polymer({
	publish: {
		options: [],
		owner :null,
	},

	observe: {
		options: "isEmpty",
		tempSelect: null

	},

	isEmpty: function () {
		if (this.options.length === 0) {
			this.hide = "";
		}
		else {
			this.hide = "hide";
		}
		this.bindData(this.options);
	},

	itemClickAction: function (event) {
		//NOTE: `event.target.value` is options's index number
		//console.log(event.target.value);
		this.owner.$.input.focus();

	},

	pressKey: function (keyCode) {
		var thisRect = this.getBoundingClientRect();
		if (keyCode == 38) {
			if (this.tempSelect.previousElementSibling !== null) {
				this.tempSelect.removeAttribute("select");
				this.tempSelect.previousElementSibling.setAttribute("select","");
				this.tempSelect = this.tempSelect.previousElementSibling;
				var optionRect = this.tempSelect.getBoundingClientRect();
				if (optionRect.top <= thisRect.top - 15) {
					this.$.data.scrollTop -= optionRect.height + 1;
				}
			}
		}
		else if (keyCode == 40) {
			if (this.tempSelect.nextElementSibling !== null) {
				this.tempSelect.removeAttribute("select");
				this.tempSelect.nextElementSibling.setAttribute("select","");
				this.tempSelect = this.tempSelect.nextElementSibling;
				var optionRect = this.tempSelect.getBoundingClientRect();
				if (optionRect.top >= (thisRect.top + thisRect.height) - 15) {
					this.$.data.scrollTop += optionRect.height + 1;
				}
			}
		}

	},

	//NOTE: 由于Polymer自带的repeat绑定数据,异步且不可控,生成节点后,不能直接进行操作,所以自己手动来绑定
	bindData: function (list) {
		this.$.ul.innerHTML = "";
		if (this.tempSelect !== undefined) {
			this.tempSelect.removeAttribute("select");
		}
		for (var i = 0; i < list.length; i++) {
			var li = document.createElement('li');
			li.className = "item";
			li.innerHTML= list[i].text;
			li.setAttribute("value",i);
			if (i === 0) {
				li.setAttribute("select","");
				this.tempSelect = li;
			}
			this.$.ul.appendChild(li);
		}
	},
});
