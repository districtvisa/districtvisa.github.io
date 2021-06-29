function add_tiles (parent, item, page, site) {
  let outer_div = create_element(parent, {
        tag: "div",
        class_name: "fofx-tiles"
      }, page, site);
  item.data.forEach(function (tile) {
    tile.content = tile.content || [];
    tile = create_element(outer_div, tile, page, site);
    create_element(tile, {
      tag: "span",
      class_name: "fofx-bg-span"
    }, page, site);
  });
}

function add_icon (parent, item, page, site) {
  item = Object.assign(item, {
    tag: "i",
    class_name: item.class_name + " las la-" + item.icon
  });
  create_element(parent, item, page, site);
}

function add_phone (parent, item, page, site) {
  delete item.type;
  item.tag = "a";
  item.attrs = {href: "tel:" + item.data};
  let phone = "(" + item.data.slice(0, 3)
              + ") " + item.data.slice(3, 6)
              + "-" + item.data.slice(6);
  item.content = [phone];
  create_element(parent, item, page, site);
}

function add_email (parent, item, page, site) {
  create_element(parent, {
    tag: "a",
    attrs: {href: "mailto:" + item.data},
    content: [item.data]
  }, page, site);
}

function add_block_list (parent, item, page, site) {
  create_element(parent, {
    tag: "table",
    class_name: "fofx-block-list",
    content: [
      {
        tag: "tbody",
        content: item.data.map(function (row) {
          return {
            tag: "tr",
            content: row.map(function (cell) {
              return {
                tag: "td",
                content: [{tag: "div", content: [cell]}]
              };
            })
          };
        })
      }
    ]
  }, page, site);
}

function add_page_tiles (parent, item, page, site) {
  let data = [];
  Object.getOwnPropertyNames(site.pages).forEach(function (path) {
    let tile = {tag: "a", attrs: {}};
    if (page.path === path) return;
    tile.attrs.href = path;
    tile.content = [site.pages[path].title];
    data.push(tile);
  });
  create_element(parent, {
    type: "tiles",
    options: item.options,
    data: data
  }, page, site);
}

let add_content_item = {
  tiles: add_tiles,
  page_tiles: add_page_tiles,
  icon: add_icon,
  phone: add_phone,
  email: add_email,
  block_list: add_block_list
};

function create_element (parent, config, page, site) {
  let el;
  if (typeof config === "string") {
    parent.innerHTML += config;
  } else {
    if (config.icon) config.type = "icon";
    if (config.tag) {
      el = document.createElement(config.tag);
      if (config.class_name) el.className = config.class_name;
      if (config.id) el.id = config.id;
      if (config.attrs) {
        Object.getOwnPropertyNames(config.attrs).forEach(function (prop) {
          el.setAttribute(prop, config.attrs[prop]);
        });
      }
      if (config.on) {
        Object.getOwnPropertyNames(config.on).forEach(function (ev) {
          el.addEventListener(ev, config.on[ev]);
        });
      }
      parent.appendChild(el);
      if (config.content) {
        config.content.forEach(function (cont) {
          create_element(el, cont, page, site);
        });
      }
    } else {
      add_content_item[config.type](parent, config, page, site);
    }
  }
  return el;
}

function add_footer (main, page, site) {
  let footer = {
        tag: "div",
        class_name: "fofx-footer",
        content: [{tag: "div", content: ["&copy; ", site.company_name]}]
      };
  if (site.email) {
    footer.content.push({tag: "div", content: [{type: "email", data: site.email}]});
  }
  create_element(main, footer, page, site);
}

function include_icons (page, site) {
  if (site.icons) {
    var src = "https://maxst.icons8.com/vue-static/landings/line-awesome/line-awesome/1.3.0/css/line-awesome.min.css";
    if (typeof site.icons === "string") {
      src = site.icons;
    }
    create_element(document.head, {
      tag: "link",
      attrs: {rel: "stylesheet", href: src}
    }, page, site);
  }
}

function add_title (page, site) {
  create_element(document.head, {
    tag: "title",
    content: [site.title + " | " + page.title]
  }, page, site);
}

function add_title_bar (main, page, site) {
  let title_bar = create_element(main, {
        tag: "div",
        class_name: "fofx-title-bar"
      }, page, site);
  create_element(title_bar, {
    tag: "a",
    attrs: {href: site.root},
    class_name: "fofx-brand",
    content: [site.company_name]
  }, page, site);
  Object.getOwnPropertyNames(site.pages).forEach(function (path) {
    if (path === site.root) return;
    create_element(title_bar, {
      tag: "a",
      class_name: "fofx-nav-item",
      attrs: {href: path},
      content: [site.pages[path].title]
    }, page, site);
  });
  create_element(title_bar, {
    tag: "div",
    class_name: "fofx-title-bar-middle"
  });
  create_element(title_bar, {
    tag: "div",
    class_name: "fofx-menu-button",
    content: [
      {class_name: "fofx-open-menu", icon: "bars"},
      {class_name: "fofx-close-menu", icon: "times"}
    ],
    on: {
      click: function () {
        main.classList.toggle("fofx-menu-open");
      }
    }
  });
}

function add_cover_images (main, body, page, site) {
  if (page.cover_images) {
    main.classList.add("fofx-with-cover-img");
    let cover_img_div = create_element(body, {
      tag: "div",
      class_name: "fofx-cover-img"
    }, page, site);
    create_element(cover_img_div, {
      tag: "div",
      content: [
        {tag: "div", content: [site.company_name]},
        {tag: "div", content: [page.tagline]}
      ]
    }, page, site);
    create_element(cover_img_div, {
      tag: "img",
      attrs: {src: page.cover_images[0]}
    }, page, site);
  }
}

function add_tagline (main, page, site) {
  if (page.tagline) {
    let tagline_div = create_element(main, {
          tag: "div",
          class_name: "fofx-tagline fofx-tagline-" + site.tagline_style
        }, page, site),
        tagline_frame = {
          tag: "div",
          class_name: "fofx-tagline-frame"
        };
    create_element(tagline_div, tagline_frame, page, site);
    create_element(tagline_div, {
      tag: "div",
      content: [page.tagline]
    }, page, site);
    create_element(tagline_div, tagline_frame, page, site);
  }
}

function add_content (main, page, site) {
  create_element(main, {
    tag: "div",
    class_name: "fofx-content",
    content: page.content
  }, page, site);
}

function add_menu (main, page, site) {
  let page_list = {
    tag: "div",
    class_name: "directory-listing",
    content: []
  };
  Object.getOwnPropertyNames(site.pages).forEach(function (path) {
    page_list.content.push({
      tag: "a",
      class_name: "directory-listing-item",
      attrs: {href: path},
      content: [site.pages[path].title]
    });
  });
  create_element(main, {
    tag: "div",
    class_name: "fofx-site-menu",
    content: [page_list]
  }, page, site);
}

function add_body(main, page, site) {
  let body_and_menu = create_element(main, {
    tag: "div",
    class_name: "fofx-body-and-menu"
  }, page, site);
  let body = create_element(body_and_menu, {
    tag: "div",
    class_name: "fofx-body"
  }, page, site);
  add_menu(body_and_menu, page, site);
  return body;
}

function add_page_header (body, page, site) {
  let page_header = page.title;
  if (page.path === site.root) return;
  create_element(body, {
    tag: "div",
    content: [
      {
        tag: "h1",
        class_name: "fofx-page-header",
        content: [page_header]
      }
    ]
  }, page, site);
}

function build_page (page, site) {
  include_icons(page, site);
  add_title(page, site);
  let main = document.createElement("div");
  main.className = "fofx-main";
  main.classList.add(site.theme);
  add_title_bar(main, page, site);
  let body = add_body(main, page, site);
  add_cover_images(main, body, page, site);
  add_page_header(body, page, site);
  // add_tagline(body, page, site);
  add_content(body, page, site);
  add_footer(body, page, site);
  document.getElementById("fofx-main").replaceWith(main);
}

function add_contact_page (site) {
  site.pages["contact.html"] = {
    title: "Contact Us",
    content: [
      {
        type: "block_list",
        data: [
          [{icon: "phone", class_name: "fofx-font-1-5"}, {type: "phone", data: site.phone}],
          [{icon: "envelope", class_name: "fofx-font-1-5"}, {type: "email", data: site.email}]
        ]
      }
    ]
  };
}

function build_site (site) {
  let page;
  if (site.include_contact) add_contact_page(site);
  Object.getOwnPropertyNames(site.pages).find(function (path) {
    if (location.pathname.endsWith(path)) {
      page = site.pages[path];
      page.path = path;
      return true;
    }
  });
  build_page(page, site);
}
