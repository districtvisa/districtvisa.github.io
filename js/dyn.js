(function () {

"use strict";

let loaded = false,
    id_counter = 0,
    curr_slots = {},
    curr_data = {},
    curr_impl,
    curr_template;

const toggle = {};

function dispatch (tmpl, el, ev_name, data) {
  const listeners = tmpl.events[ev_name] || [];
  for (const listener of listeners) listener(el, data);
}

window.addEventListener("load", () => loaded = true);

function on_load (cb) {
  if (loaded) {
    cb();
  } else {
    window.addEventListener("load", cb);
  }
}

class FOFX_Cmp_Spec extends HTMLElement {
  constructor () {
    super();
    this.attachShadow({mode: "open"});
  }
  events = {};
  impls = [];
  __data = {};
  data (nm) {
    return this.__data[nm];
  }
  dispatch (ev_name, data) {
    if (arguments.length === 1) {
      for (const _ev_name in ev_name) {
        this.dispatch(_ev_name, ev_name[_ev_name]);
      }
    } else {
      ((data) => {
        if (data === toggle) {
          data = this.__data[ev_name] ? null : ev_name;
        }
        this.__data[ev_name] = data;
      })(data);
      this.impls.forEach(function ({el, data: _data}) {
        if (data === toggle) {
          data = _data[ev_name] ? null : ev_name;
        }
        _data[ev_name] = data;
        const listeners = this.events[ev_name] || [];
        for (const listener of listeners) {
          listener(el, data);
        }
      }, this);
    }
  }
  on (ev_name, hdl) {
    if (arguments.length === 1) {
      for (const nm in ev_name) this.on(nm, ev_name[nm]);
    } else if (typeof ev_name === "string") {
      if (!this.events[ev_name]) this.events[ev_name] = [];
      this.events[ev_name].push(hdl);
      if (this !== fofx_live) {
        const that = this;
        fofx_live.on(ev_name, function (el, data) {
          that.dispatch(ev_name, data);
        });
      }
    } else {

    }
  }
  toggle (ev_name) {
    this.dispatch(ev_name, toggle);
  }
}

class FOFX_Cmp_Impl extends HTMLElement {
  constructor () {
    super();
    this.attachShadow({mode: "open"});
  }
  slots = {};
  data = {};
}

customElements.define("fofx-live", class extends FOFX_Cmp_Spec { });
const fofx_live = window.fofx_live = curr_template = document.createElement("fofx-live");
fofx_live.impls = [{el: fofx_live, data: curr_data}];

fofx_live.media_query = function (qry, hdl) {
  const media_query = window.matchMedia(`(${qry})`);
  function cb (m) { hdl(m.matches); }
  on_load(() => cb(media_query));
  media_query.addEventListener("change", cb);
  return this;
}

const component_registry = {};

function add_event_listener (ev_name, hdl, tmpl) {
  tmpl.on("load", function (el, data) {
    el.addEventListener(ev_name, function () {
      hdl(el, data);
    });
  });
}

class FOFX_Cmp_Proxy {
  constructor (cmp_name) {
    this.name = cmp_name;
  }
  on (ev_name, hdl) {
    const prev = component_registry[this.name];
    let new_hdl;
    switch (ev_name) {
      case "click":
      case "transitionend":
        new_hdl = tmpl => add_event_listener(ev_name, hdl, tmpl);
      break;
      default:
        new_hdl = tmpl => tmpl.on(ev_name, hdl);
    }
    component_registry[this.name] = prev ? function (tmpl) {
      new_hdl(tmpl);
      prev(tmpl);
    } : new_hdl;
    return this;
  }
}

fofx_live.component = function (name) {
  return new FOFX_Cmp_Proxy(name);
};

function add_class_listener (attr, tmpl) {
  const classes = attr.nodeValue.split(" ");
  for (const cls of classes) {
    let last_val;
    function hdl (el, data) {
      if (data) {
        if (last_val) {
          el.classList.replace(last_val, data);
        } else {
          el.classList.add(data);
        }
      } else if (last_val) {
        el.classList.remove(last_val);
      }
      last_val = data;
    }
    tmpl.on(cls, hdl);
    tmpl.on("load", (el, data) => hdl(el, data[cls]));
  }
}

function add_attribute_listener (attr, tmpl) {
  const attr_name = attr.nodeName;
  const attr_val = attr.nodeValue;
  const pattern = attr_val.match(/\{\{.+\}\}/)[0];
  const ev_name = pattern.slice(2,-2);
  const set_val = val => attr_val.replace(pattern, val);
  tmpl.on(ev_name, function (el, data) {
    el.setAttribute(attr_name, set_val(data));
  });
  tmpl.on("load", function (el, data) {
    el.setAttribute(attr_name, set_val(data[ev_name]));
  });
}

function add_attr_listeners (tmpl) {
  for (const attr of tmpl.attributes) {
    const nm = attr.nodeName;
    switch (nm) {
      case "class": add_class_listener(attr, tmpl); break;
      default:
        if (!nm.startsWith("fofx-")) {
          add_attribute_listener(attr, tmpl);
        }
    }
  }
}

function init_spec (tmpl) {
  add_attr_listeners(tmpl);
  let classes = tmpl.getAttribute("fofx-class");
  classes = classes ? classes.split(" ") : [];
  classes.push(tmpl.getAttribute("fofx-name"));
  for (const name of classes) {
    const reg = component_registry[name];
    if (reg) reg(tmpl);
  }
}

function init_impl (tmpl, impl) {
  dispatch(tmpl, impl, "init", curr_data);
  curr_impl = impl;
  curr_template = tmpl;
}

function register_el (tmpl, el) {
  tmpl.impls.push({el: el, data: curr_data});
  dispatch(tmpl, el, "load", curr_data);
}

function load_template (impl, tmpl) {
  on_load(function load () {
    if (!impl.isConnected) return;
    const prev_impl = curr_impl;
    const prev_slots = curr_slots;
    const prev_data = curr_data;
    curr_slots = Object.assign(Object.create(curr_slots), impl.slots);
    curr_data = Object.assign(Object.create(curr_data), impl.data);
    init_impl(tmpl, impl);
    const clone = tmpl.cloneNode(true);
    // this triggers processing of template:
    impl.appendChild(clone);
    // replace both template and impl
    // with template's processed children
    const doc = new DocumentFragment;
    const children = [];
    for (const child of clone.children) {
      children.push(child);
      doc.appendChild(child);
      register_el(tmpl, child);
    }
    impl.parentNode.replaceChild(doc, impl);
    curr_impl = prev_impl;
    curr_slots = prev_slots;
    curr_data = prev_data;
  });
}

function check_empty_slot (impl, tmpl) {
  if (tmpl.querySelector("[name=fofx-empty-slot]")) {
    const new_slot = document.createElement("fofx-empty-slot");
    while (impl.children.length) new_slot.appendChild(impl.children[0]);
    impl.appendChild(new_slot);
  }
}

function def_template (template) {
  const name = template.getAttribute("fofx-name");
  customElements.define(name, class extends FOFX_Cmp_Impl {
    connectedCallback () {
      if (this.closest("fofx-load-templates")) return;
      if (this.closest("fofx-template")) return;
      check_empty_slot(this, template);
      load_template(this, template);
    }
  });
}

function copy_attrs (src, tgt) {
  for (const attr of src.attributes) {
    const name = attr.nodeName,
          val = attr.nodeValue;
    if (name.startsWith("var-")) {
      const var_name = "-" + name.slice(3);
      tgt.style.setProperty(var_name, val);
    } else if (name === "class") {
      tgt.classList.add(val);
    } else {
      tgt.setAttribute(name, val);
    }
  }
}

customElements.define("fofx-template", class extends FOFX_Cmp_Spec {
  connectedCallback () {
    if (curr_impl) {
      copy_attrs(curr_impl, this.children[0]);
    } else {
      init_spec(this);
      def_template(this);
      this.parentNode.removeChild(this);
      if (!this.children.length) {
        this.appendChild(document.createElement("fofx-empty-slot"));
      }
    }
  }
});

function copy_slot (impl, _slot) {
  let slot = _slot.cloneNode(true);
  const is_clear = _slot.hasAttribute("fofx-clear");
  if (slot.children.length) {
    slot = slot.children[0];
    register_el(_slot, slot);
    if (!is_clear) {
      copy_attrs(impl, slot);
    }
  } else {
    slot = new DocumentFragment();
  }
  if (!slot.children.length && !is_clear) {
    for (const child of impl.childNodes) {
      slot.appendChild(child.cloneNode(true));
    }
  }
  return slot;
}

const slots = {};

function def_slot (slot, name) {
  if (slots[name]) return;
  slots[name] = true;
  customElements.define(name, class extends FOFX_Cmp_Impl {
    connectedCallback () {
      if (!this.done) {
        this.done = true;
        const slots = this.parentNode.slots;
        if (!slots) return;
        if (!slots.hasOwnProperty(name)) slots[name] = [];
        slots[name].push(this);
      }
    }
  });
}

customElements.define("fofx-slot", class extends FOFX_Cmp_Spec {
  connectedCallback () {
    const name = this.getAttribute("fofx-name");
    if (curr_impl) {
      const sibling = this.nextSibling;
      const prev_tmpl = curr_template;
      const prev_slots = curr_slots;
      const prev_data = curr_data;
      const fofx_id = this.getAttribute("fofx-id");
      const prev_impl = curr_impl;
      curr_template = curr_template.querySelector(`[fofx-id="${fofx_id}"]`);
      curr_slots = Object.assign(Object.create(curr_slots), curr_impl.slots);
      curr_data = Object.assign(Object.create(curr_data), curr_impl.data);
      const impls = curr_slots[name] || [];
      const _prev_data = curr_data;
      for (const impl of impls) {
        curr_data = Object.assign(Object.create(curr_data), impl.data);
        init_impl(curr_template, impl);
        const copied = copy_slot(impl, curr_template);
        this.parentNode.insertBefore(copied, sibling);
        curr_impl = prev_impl;
        curr_data = _prev_data;
      }
      this.parentNode.removeChild(this);
      curr_template = prev_tmpl;
      curr_impl = prev_impl;
      curr_slots = prev_slots;
      curr_data = prev_data;
    } else {
      init_spec(this);
      def_slot(this, name);
      this.setAttribute("fofx-id", id_counter++);
    }
  }
});

customElements.define("fofx-text", class extends FOFX_Cmp_Spec {
  connectedCallback () {
    if (curr_impl) {
      let last_node = document.createTextNode("");
      this.parentNode.replaceChild(last_node, this);
      register_el(this, this);
      this.data = Object.create(curr_data);
      const that = this;
      const fofx_id = this.getAttribute("fofx-id");
      const tmpl = curr_template.querySelector(`[fofx-id="${fofx_id}"]`);
      function hdl (el, data) {
        const text_node = document.createTextNode(data);
        dispatch(tmpl, text_node, "init", curr_data);
        last_node.parentNode.replaceChild(text_node, last_node);
        last_node = text_node;
      }
      const ev_name = this.getAttribute("fofx-name");
      hdl(this, this.data[ev_name]);
      this.on(ev_name, hdl);
    } else {
      this.setAttribute("fofx-id", id_counter++);
      init_spec(this);
    }
  }
});

customElements.define("fofx-load-templates", class extends FOFX_Cmp_Impl {
  connectedCallback () {
    const iframe = document.createElement("iframe");
    const cmp = this;
    const main_name = cmp.getAttribute("main");
    const doc = document.createElement(main_name);
    iframe.onload = function () {
      const body = iframe.contentWindow.document.body;
      for (let child of body.children) {
        child = document.importNode(child, true);
        cmp.parentNode.insertBefore(child, cmp);
      }
      while (cmp.children.length) {
        const child = cmp.children[0];
        cmp.removeChild(child);
        if (child !== iframe) doc.appendChild(child.cloneNode(true));
      }
      cmp.parentNode.replaceChild(doc, cmp);
    };
    this.appendChild(iframe);
    iframe.src = this.getAttribute("src");
  }
});

customElements.define("fofx-component", class extends FOFX_Cmp_Spec {
  connectedCallback () {
    if (curr_impl) {
      this.data = Object.create(curr_data);
      const prev_tmpl = curr_template;
      const fofx_id = this.getAttribute("fofx-id");
      curr_template = curr_template.querySelector(`[fofx-id="${fofx_id}"]`);
      const doc = new DocumentFragment;
      const children = [];
      for (let child of this.children) {
        child = child.cloneNode(true);
        children.push(child);
        doc.appendChild(child);
      }
      this.parentNode.replaceChild(doc, this);
      for (const child of children) {
        register_el(curr_template, child);
      }
      curr_template = prev_tmpl;
    } else {
      this.setAttribute("fofx-id", id_counter++);
      init_spec(this);
    }
  }
});

customElements.define("fofx-data", class extends FOFX_Cmp_Spec {
  connectedCallback () {
    const name = this.getAttribute("fofx-name");
    const val = this.textContent;
    this.parentNode.data[name] = val;
  }
});

})();
