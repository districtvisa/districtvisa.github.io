function create_element
({
  parent,
  tag_name,
  class_name,
  attrs,
  content
})
{
  tag_name = tag_name || "div";
  let el = document.createElement(tag_name);
  if (class_name) el.className = class_name;
  if (content) el.innerHTML = content;
  if (attrs) {
    Object.getOwnPropertyNames(attrs).forEach(function (prop) {
      el.setAttribute(prop, attrs[prop]);
    });
  }
  parent.appendChild(el);
  return el;
}

function add_action_tiles (parent, item, config) {
  let {items} = item,
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
    create_element(tile);
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

let add_content = {
  action_tiles: add_action_tiles,
  paragraph: add_paragraph
};

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
        attrs: {href: "index.html"},
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
  let footer = create_element({
        parent: main,
        class_name: "footer",
        content: "&copy; " + company_name
      });
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

