function content_type_email (parent, {content}) {
  create_element({
    parent: parent,
    tag_name: "a",
    attrs: {href: "mailto:" + content},
    content: content
  });
}

let content_types = {
  email: content_type_email
};

function create_element (config) {
  let {
        parent,
        tag_name,
        class_name,
        id,
        attrs,
        content,
        content_type
      } = config;
  tag_name = tag_name || "div";
  let el = document.createElement(tag_name);
  if (class_name) el.className = class_name;
  if (id) el.id = id;
  if (attrs) {
    Object.getOwnPropertyNames(attrs).forEach(function (prop) {
      el.setAttribute(prop, attrs[prop]);
    });
  }
  if (content_type) {
    content_types[content_type](el, config);
  } else if (content) {
    el.innerHTML = content;
  }
  parent.appendChild(el);
  return el;
}

function add_action_tiles (parent, item, config) {
  let {items, background} = item,
      all_pages = items === "pages",
      outer_div = create_element({
        parent: parent,
        class_name: "action-tiles"
      }),
      inner_div = create_element({parent: outer_div});
  if (all_pages) items = Object.getOwnPropertyNames(config.pages);
  items.forEach(function (item_config) {
    let tile = {parent: inner_div, tag_name: "a", attrs: {}};
    if (all_pages) {
      if (config.path === item_config) return;
      tile.attrs.href = item_config;
      tile.content = config.pages[item_config].title;
    }
    tile = create_element(tile);
    if (background) {
      create_element({
        parent: tile,
        tag_name: "span",
        class_name: "bg-span",
        attrs: {style: "background-image:url('" + background + "')"}
      });
    }
  });
}

function add_paragraph (parent, item, config) {
  let {content} = item,
      p = create_element({
        parent: parent,
        tag_name: "p",
        content: content
      });
}

function add_element (parent, item, config) {
  item.parent = parent;
  create_element(item);
}

let add_content = {
  action_tiles: add_action_tiles,
  paragraph: add_paragraph,
  element: add_element
};

function add_footer (main, config) {
  let {
       company_name,
       email
      } = config,
      footer = create_element({
        parent: main,
        class_name: "footer"
      });
  create_element({
    parent: footer,
    content: "&copy; " + company_name
  });
  if (email) {
    create_element({
      parent: footer,
      content_type: "email",
      content: email
    });
  }
}

function build_page (config) {
  let {
        site_title,
        title,
        root,
        cover_images,
        company_name,
        title_bar_style,
        tagline,
        tagline_style,
        content
      } = config,
      main = document.getElementById("main");
  create_element({
    parent: document.head,
    tag_name: "title",
    content: site_title + " | " + title
  });
  main.classList.add("container");
  let title_bar = create_element({
        parent: main,
        class_name: "title-bar title-bar-" + title_bar_style
      }),
      brand = create_element({
        parent: title_bar,
        tag_name: "a",
        attrs: {href: root},
        class_name: "brand",
        content: company_name
      });
  if (cover_images) {
    title_bar.classList.add("title-bar-fixed");
    let cover_img_div = create_element({
          parent: main,
          class_name: "cover-img bg-gray"
        }),
        cover_img = create_element({
          parent: cover_img_div,
          tag_name: "img",
          attrs: {src: cover_images[0]}
        });
  } else {
    title_bar.classList.add("title-bar-sticky");
  }
  if (tagline) {
    let tagline_div = create_element({
          parent: main,
          class_name: "tagline tagline-" + tagline_style
        }),
        tagline_frame = {
          parent: tagline_div,
          class_name: "tagline-frame"
        };
    create_element(tagline_frame);
    create_element({parent: tagline_div, content: tagline});
    create_element(tagline_frame);
  }
  content.forEach((item) => add_content[item.type](main, item, config));
  add_footer(main, config);
}

function build_site (config) {
  let page;
  Object.getOwnPropertyNames(config.pages).find(function (path) {
    if (location.pathname.endsWith(path)) {
      let this_page = config.pages[path];
      page = Object.assign(this_page, config);
      page.path = path;
      return true;
    }
  });
  build_page(page);
}

