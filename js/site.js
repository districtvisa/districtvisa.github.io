function add_tiles (parent, item, page, site) {
  let outer_div = create_element(parent, {
        tag: "div",
        classes: ["fofx-tiles"]
      }, page, site);
  item.data.forEach(function (tile) {
    tile.content = tile.content || [];
    tile.classes = ["fofx-tile"];
    tile = create_element(outer_div, tile, page, site);
  });
}

function add_icon (parent, item, page, site) {
  item = Object.assign(item, {
    tag: "span",
    classes: ["fofx-icon", "fofx-icon-" + item.icon]
    //tag: "object",
    //attrs: {type: "image/svg+xml", data: "img/" + item.icon + ".svg"}
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
  item.classes.push("fofx-block-list");
  create_element(parent, {
    tag: "div",
    classes: item.classes,
    content: item.data.reduce(function (p, c) {
      var last_cell;
      let out = p.concat(c.map(function (cell, i) {
        last_cell = {tag: "div", content: [cell]};
        return last_cell;
      }));
      last_cell.classes = ["fofx-row-end"];
      return out;
    }, [])
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
      if (config.classes) el.className = config.classes.join(" ");
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
        classes: ["fofx-footer-content"],
        content: [{tag: "div", content: ["&copy; ", site.company_name]}]
      },
      footer = {
        tag: "div",
        classes: ["fofx-footer"],
        content: [footer_content]
      };
  if (site.email) {
    footer_content.content.push({
      tag: "div",
      content: [
        {
          type: "link",
          content: ["Contact Us"],
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
        classes: ["fofx-nav-bar"],
        content: site.nav_bar_links
      };
  nav_bar.content.push({
    tag: "div",
    classes: ["fofx-menu-button"],
    content: [
      {
        tag: "a",
        classes: ["fofx-open-menu"],
        content: [{icon: "menu"}],
      }
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
      classes: ["fofx-cover-img"]
    }, page, site);
    let cover_img_div_cover = create_element(cover_img_div, {
      tag: "div",
      classes: ["cover-img-div-cover"]
    }, page, site);
    create_element(cover_img_div_cover, {
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
          classes: ["fofx-tagline", "fofx-tagline-" + site.tagline_style]
        }, page, site),
        tagline_frame = {
          tag: "div",
          classes: ["fofx-tagline-frame"]
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
    classes: ["fofx-content"],
    content: page.content
  }, page, site);
}

function add_menu (main, page, site) {
  let page_list = {
    tag: "div",
    classes: ["directory-listing"],
    content: site.menu_links
  };
  let close_menu = {
    tag: "div",
    classes: ["fofx-menu-button"],
    content: [
      {
        tag: "a",
        classes: ["fofx-close-menu"],
        content: [{icon: "close"}]
      }
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
    classes: ["fofx-site-menu"],
    content: [top, page_list]
  }, page, site);
}

function add_body(main, page, site) {
  let body_and_menu = create_element(main, {
    tag: "div",
    classes: ["fofx-body-and-menu"]
  }, page, site);
  let body = create_element(body_and_menu, {
    tag: "div",
    classes: ["fofx-body"]
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
        classes: ["fofx-page-header"],
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
          classes: ["fofx-carousel-background"],
          content: [
            {
              tag: "div",
              classes: ["fofx-carousel-text"],
              content: [
                {tag: "div", content: [header]},
                {tag: "div", content: [subheader]}
              ]
            }
          ]
        }
      ]
    };
  });
  return {
    tag: "div",
    classes: ["fofx-carousel"],
    content: content
  };
}

function top_bottom (page, site) {
  let content = [{type: "page_tiles"}];
  return {
    tag: "div",
    classes: ["fofx-bottom"],
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
          classes: ["fofx-block-list-2"],
          data: [
            [{icon: "phone"}, {type: "phone", data: site.phone}],
            [{icon: "mail"}, {type: "email", data: site.email}]
          ]
        }
      ],
      title_bar: true,
      tile: true
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
    classes: ["fofx-brand"],
    content: [site.logo || site.company_name]
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
          classes: ["directory-listing-item"],
          attrs: {href: "?page=" + path},
          content: [this_page.title]
        });
      }
    }
    if (this_page.title_bar) {
      site.nav_bar_links.push({
        tag: "a",
        classes: ["fofx-nav-link"],
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
  const mediaQuery = window.matchMedia(`(max-width: ${site.breakpoint}px)`);
  function toggle_screen (e) {
    if (e.matches) {
      document.body.classList.add("fofx-breakpoint");
    } else {
      document.body.classList.remove("fofx-breakpoint");
    }
  }
  toggle_screen(mediaQuery);
  mediaQuery.addEventListener("change", toggle_screen);
}
