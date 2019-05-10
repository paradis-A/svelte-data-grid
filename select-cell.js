(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global['select-cell'] = factory());
}(this, (function () { 'use strict';

	function noop() {}

	function assign(tar, src) {
		for (var k in src) tar[k] = src[k];
		return tar;
	}

	function append(target, node) {
		target.appendChild(node);
	}

	function insert(target, node, anchor) {
		target.insertBefore(node, anchor);
	}

	function detachNode(node) {
		node.parentNode.removeChild(node);
	}

	function destroyEach(iterations, detach) {
		for (var i = 0; i < iterations.length; i += 1) {
			if (iterations[i]) iterations[i].d(detach);
		}
	}

	function createElement(name) {
		return document.createElement(name);
	}

	function createText(data) {
		return document.createTextNode(data);
	}

	function addListener(node, event, handler, options) {
		node.addEventListener(event, handler, options);
	}

	function removeListener(node, event, handler, options) {
		node.removeEventListener(event, handler, options);
	}

	function setData(text, data) {
		text.data = '' + data;
	}

	function blankObject() {
		return Object.create(null);
	}

	function destroy(detach) {
		this.destroy = noop;
		this.fire('destroy');
		this.set = noop;

		this._fragment.d(detach !== false);
		this._fragment = null;
		this._state = {};
	}

	function _differs(a, b) {
		return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
	}

	function fire(eventName, data) {
		var handlers =
			eventName in this._handlers && this._handlers[eventName].slice();
		if (!handlers) return;

		for (var i = 0; i < handlers.length; i += 1) {
			var handler = handlers[i];

			if (!handler.__calling) {
				try {
					handler.__calling = true;
					handler.call(this, data);
				} finally {
					handler.__calling = false;
				}
			}
		}
	}

	function flush(component) {
		component._lock = true;
		callAll(component._beforecreate);
		callAll(component._oncreate);
		callAll(component._aftercreate);
		component._lock = false;
	}

	function get() {
		return this._state;
	}

	function init(component, options) {
		component._handlers = blankObject();
		component._slots = blankObject();
		component._bind = options._bind;
		component._staged = {};

		component.options = options;
		component.root = options.root || component;
		component.store = options.store || component.root.store;

		if (!options.root) {
			component._beforecreate = [];
			component._oncreate = [];
			component._aftercreate = [];
		}
	}

	function on(eventName, handler) {
		var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
		handlers.push(handler);

		return {
			cancel: function() {
				var index = handlers.indexOf(handler);
				if (~index) handlers.splice(index, 1);
			}
		};
	}

	function set(newState) {
		this._set(assign({}, newState));
		if (this.root._lock) return;
		flush(this.root);
	}

	function _set(newState) {
		var oldState = this._state,
			changed = {},
			dirty = false;

		newState = assign(this._staged, newState);
		this._staged = {};

		for (var key in newState) {
			if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
		}
		if (!dirty) return;

		this._state = assign(assign({}, oldState), newState);
		this._recompute(changed, this._state);
		if (this._bind) this._bind(changed, this._state);

		if (this._fragment) {
			this.fire("state", { changed: changed, current: this._state, previous: oldState });
			this._fragment.p(changed, this._state);
			this.fire("update", { changed: changed, current: this._state, previous: oldState });
		}
	}

	function _stage(newState) {
		assign(this._staged, newState);
	}

	function callAll(fns) {
		while (fns && fns.length) fns.shift()();
	}

	function _mount(target, anchor) {
		this._fragment[this._fragment.i ? 'i' : 'm'](target, anchor || null);
	}

	var proto = {
		destroy,
		get,
		fire,
		on,
		set,
		_recompute: noop,
		_set,
		_stage,
		_mount,
		_differs
	};

	/* src\select-cell.html generated by Svelte v2.16.1 */

	function getOptionDisplay(display) {
	  if (display instanceof Function) {
	    return display();
	  }

	  return display;
	}
	var methods = {
	  onChange(event) {
	    const { row, column, rowNumber } = this.get();

	    // delay this until after the ui updates on the screen
	    setTimeout(() => {
	      this.fire('valueupdate', {
	        row,
	        column,
	        value: this.refs.select.value,
	        rowNumber
	      });
	    }, 0);
	    
	  }
	};

	function add_css() {
		var style = createElement("style");
		style.id = 'svelte-1sr1x1m-style';
		style.textContent = ".select-cell.svelte-1sr1x1m{background:white;overflow:hidden;text-overflow:ellipsis}select.svelte-1sr1x1m{border:none}select.svelte-1sr1x1m{width:100%;height:100%;padding:0 5px}";
		append(document.head, style);
	}

	function get_each_context(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.option = list[i];
		return child_ctx;
	}

	function create_main_fragment(component, ctx) {
		var div;

		var if_block = (ctx.column.options instanceof ctx.Array) && create_if_block(component, ctx);

		return {
			c() {
				div = createElement("div");
				if (if_block) if_block.c();
				div.className = "select-cell svelte-1sr1x1m";
			},

			m(target, anchor) {
				insert(target, div, anchor);
				if (if_block) if_block.m(div, null);
			},

			p(changed, ctx) {
				if (ctx.column.options instanceof ctx.Array) {
					if (if_block) {
						if_block.p(changed, ctx);
					} else {
						if_block = create_if_block(component, ctx);
						if_block.c();
						if_block.m(div, null);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}
			},

			d(detach) {
				if (detach) {
					detachNode(div);
				}

				if (if_block) if_block.d();
			}
		};
	}

	// (2:2) {#if column.options instanceof Array}
	function create_if_block(component, ctx) {
		var select;

		var each_value = ctx.column.options;

		var each_blocks = [];

		for (var i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block(component, get_each_context(ctx, each_value, i));
		}

		function change_handler(event) {
			component.onChange(event);
		}

		return {
			c() {
				select = createElement("select");

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}
				addListener(select, "change", change_handler);
				select.className = "svelte-1sr1x1m";
			},

			m(target, anchor) {
				insert(target, select, anchor);

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(select, null);
				}

				component.refs.select = select;
			},

			p(changed, ctx) {
				if (changed.column || changed.row) {
					each_value = ctx.column.options;

					for (var i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(changed, child_ctx);
						} else {
							each_blocks[i] = create_each_block(component, child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(select, null);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}
					each_blocks.length = each_value.length;
				}
			},

			d(detach) {
				if (detach) {
					detachNode(select);
				}

				destroyEach(each_blocks, detach);

				removeListener(select, "change", change_handler);
				if (component.refs.select === select) component.refs.select = null;
			}
		};
	}

	// (4:6) {#each column.options as option}
	function create_each_block(component, ctx) {
		var option, text_value = getOptionDisplay(ctx.option.display), text, option_value_value, option_selected_value;

		return {
			c() {
				option = createElement("option");
				text = createText(text_value);
				option.__value = option_value_value = ctx.option.value;
				option.value = option.__value;
				option.selected = option_selected_value = ctx.option.value === ctx.row.data[ctx.column.dataName];
			},

			m(target, anchor) {
				insert(target, option, anchor);
				append(option, text);
			},

			p(changed, ctx) {
				if ((changed.column) && text_value !== (text_value = getOptionDisplay(ctx.option.display))) {
					setData(text, text_value);
				}

				if ((changed.column) && option_value_value !== (option_value_value = ctx.option.value)) {
					option.__value = option_value_value;
				}

				option.value = option.__value;
				if ((changed.column || changed.row) && option_selected_value !== (option_selected_value = ctx.option.value === ctx.row.data[ctx.column.dataName])) {
					option.selected = option_selected_value;
				}
			},

			d(detach) {
				if (detach) {
					detachNode(option);
				}
			}
		};
	}

	function Select_cell(options) {
		init(this, options);
		this.refs = {};
		this._state = assign({ Array : Array }, options.data);
		this._intro = true;

		if (!document.getElementById("svelte-1sr1x1m-style")) add_css();

		this._fragment = create_main_fragment(this, this._state);

		if (options.target) {
			this._fragment.c();
			this._mount(options.target, options.anchor);
		}
	}

	assign(Select_cell.prototype, proto);
	assign(Select_cell.prototype, methods);

	return Select_cell;

})));