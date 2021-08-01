function add_tiles (parent, item, page, site) {
  let outer_div = create_element(parent, {
        tag: "div",
        class_name: "fofx-tiles"
      }, page, site);
  item.data.forEach(function (tile) {
    tile.content = tile.content || [];
    tile.class_name = "fofx-tile";
    tile = create_element(outer_div, tile, page, site);
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

function add_link (parent, item, page, site) {
  let href = item.data;
  if (item.prefix) href = item.prefix + href;
  create_element(parent, {
    tag: "a",
    attrs: {href: href},
    content: item.content || [item.data]
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
  create_element(parent, {
    type: "tiles",
    options: item.options,
    data: site.page_tiles
  }, page, site);
}

function add_list (parent, item, page, site) {
  create_element(parent, {
    tag: item.type,
    options: item.options || {},
    content: item.data.map(function (item) {
      return {tag: "li", content: item};
    })
  })
}

let add_content_item = {
  tiles: add_tiles,
  page_tiles: add_page_tiles,
  icon: add_icon,
  phone: add_phone,
  email: add_email,
  link: add_link,
  ul: add_list,
  ol: add_list,
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
      if (config.style) {
        Object.getOwnPropertyNames(config.style).forEach(function (prop) {
          el.style[prop] = config.style[prop];
        })
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
  let footer_content = {
        tag: "div",
        class_name: "fofx-footer-content",
        content: [{tag: "div", content: ["&copy; ", site.company_name]}]
      },
      footer = {
        tag: "div",
        class_name: "fofx-footer",
        content: [footer_content]
      };
  if (site.email) {
    footer_content.content.push({
      tag: "div",
      content: [
        {
          type: "link",
          content: ["Contact"],
          data: "?page=contact"
        }
      ]
    });
  }
  create_element(main, footer, page, site);
}

function include_icons (page, site) {
  if (page.include_icons) {
    let src = "https://maxst.icons8.com/vue-static/landings/line-awesome/line-awesome/1.3.0/css/line-awesome.min.css";
    if (typeof page.icons === "string") src = page.icons;
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

function nav_bar (main, page, site) {
  let nav_bar = {
        tag: "div",
        class_name: "fofx-nav-bar",
        content: site.nav_bar_links
      };
  nav_bar.content.push({
    tag: "div",
    class_name: "fofx-menu-button",
    content: [
      {class_name: "fofx-open-menu", icon: "bars"}
    ],
    on: {
      click: (e) => main.classList.add("fofx-menu-open")
    }
  });
  return nav_bar;
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
    content: site.menu_links
  };
  let close_menu = {
    tag: "div",
    class_name: "fofx-menu-button",
    content: [
      {class_name: "fofx-close-menu", icon: "times"}
    ],
    on: {
      click: (e) => main.classList.remove("fofx-menu-open")
    }
  };
  let top = {
    tag: "div",
    content: [site.brand, close_menu]
  };
  create_element(main, {
    tag: "div",
    class_name: "fofx-site-menu",
    content: [top, page_list]
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

function page_header (page, site) {
  return {
    tag: "div",
    content: [
      {
        tag: "h1",
        class_name: "fofx-page-header",
        content: [page.title]
      }
    ]
  };
}

function image_carousel (images) {
  let content = images.map(function ({src, header, subheader}) {
    return {
      tag: "div",
      style: {"background-image": "url(" + src + ")"},
      content: [
        {
          tag: "div",
          class_name: "fofx-carousel-text",
          content: [
            {tag: "div", content: [header]},
            {tag: "div", content: [subheader]}
          ]
        }
      ]
    };
  });
  return {
    tag: "div",
    class_name: "fofx-carousel",
    content: content
  };
}

function top_bottom (page, site) {
  let content = [{type: "page_tiles"}];
  return {
    tag: "div",
    class_name: "fofx-bottom",
    content: content
  };
}

function add_top (main, page, site) {
  create_element(main, nav_bar(main, page, site), page, site);
  if (page.cover_images) {
    main.classList.add("fofx-with-cover-image");
    create_element(main, image_carousel(page.cover_images), page, site);
    create_element(main, top_bottom(page, site), page, site);
  } else {
    create_element(main, page_header(page, site), page, site);
  }
}

function build_page (page, site) {
  include_icons(page, site);
  add_title(page, site);
  let main = document.createElement("div");
  main.classList.add("fofx-main", site.theme);
  add_top(main, page, site);
  add_content(main, page, site);
  add_footer(main, page, site);
  add_menu(main, page, site);
  document.getElementById("fofx-main").replaceWith(main);
}

let templates = {
  "contact": function (site) {
    return {
      title: "Contact Us",
      content: [
        {
          type: "block_list",
          data: [
            [{icon: "phone", class_name: "fofx-font-1-5"}, {type: "phone", data: site.phone}],
            [{icon: "envelope", class_name: "fofx-font-1-5"}, {type: "email", data: site.email}]
          ]
        }
      ],
      title_bar: true,
      tile: true,
      include_icons: "css/line-awesome.min.css"
    };
  }
};

function prepare_site (site) {
  site_config = site;
  site.show_menu = 0;
  site.page_tiles = [];
  site.brand = {
    tag: "a",
    attrs: {href: "?page=home"},
    class_name: "fofx-brand",
    content: [site.company_name]
  };
  site.nav_bar_links = [site.brand];
  site.menu_links = [];
  Object.getOwnPropertyNames(site.pages).forEach(function (path) {
    let this_page = site.pages[path],
        templ = this_page.template;
    if (templ) {
      let template = templates[templ](site);
      this_page = Object.assign(template, this_page);
      site.pages[path] = this_page;
    }
    if (path !== site.root) {
      if (this_page.tile) {
        site.page_tiles.push({
          tag: "a",
          attrs: {href: "?page=" + path},
          content: [this_page.title]
        });
      }
      if (this_page.title_bar) {
        site.menu_links.push({
          tag: "a",
          class_name: "directory-listing-item",
          attrs: {href: "?page=" + path},
          content: [this_page.title]
        });
      }
    }
    if (this_page.title_bar) {
      site.nav_bar_links.push({
        tag: "a",
        class_name: "fofx-nav-link",
        attrs: {href: "?page=" + path},
        content: [this_page.title]
      });
    } else {
      site.show_menu++;
    }
  });
}

function build_site (site) {
  prepare_site(site);
  let params = new URLSearchParams(location.search);
  let path = params.get("page");
  let page = site.pages[path];
  if (page) {
    build_page(page, site);
  } else {
    location.href = "?page=home";
  }
}
