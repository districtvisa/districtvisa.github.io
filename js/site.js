function create_element
({
  parent,
  tag_name,
  class_name,
  attrs,
  content
})
{
  var el = document.createElement(tag_name);
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

function build_site
({
  page_type,
  company_name,
  title_bar_style,
  cover_images,
  tagline,
  tagline_style
})
{
  var main = document.getElementById("main");
  main.classList.add("container");
  var title_bar = create_element({
        parent: main,
        tag_name: "div",
        class_name: "title-bar title-bar-" + title_bar_style
      }),
      brand_div = create_element({
        parent: title_bar,
        tag_name: "div",
        class_name: "brand",
        content: company_name
      });
      cover_img_div = create_element({
        parent: main,
        tag_name: "div",
        class_name: "cover-img bg-gray"
      }),
      cover_img = create_element({
        parent: cover_img_div,
        tag_name: "img",
        attrs: {src: cover_images[0]}
      });
  if (tagline) {
    var tagline_div = create_element({
          parent: main,
          tag_name: "div",
          class_name: "tagline tagline-" + tagline_style
        }),
        tagline_frame = {
          parent: tagline_div,
          tag_name: "div",
          class_name: "tagline-frame"
        };
    create_element(tagline_frame);
    create_element({parent: tagline_div, tag_name: "div", content: tagline});
    create_element(tagline_frame);
  }
  var footer = create_element({
        parent: main,
        tag_name: "div",
        class_name: "footer",
        content: "&copy; " + company_name
      });
}
