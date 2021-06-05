build_site({
  company_name: "District Visa",
  title_bar_style: "light",
  tagline_style: "light cursive",
  site_title: "District Visa",
  root: "index.html",
  email: "info@districtvisa.com",
  pages: {
    "index.html": {
      title: "Home",
      cover_images: ["img/capitol.jpg"],
      tagline: "Apostille and Document Authentication Services",
      content: [
        {
          type: "action_tiles",
          background: "img/flag.webp",
          items: "pages"
        }
      ]
    },
    "contact.html": {
      title: "Contact Us",
      content: [{type: "paragraph", content: "Hello"}]
    },
    "order-form.html": {
      title: "Order Form",
      content: [
        {type: "element", id: "form"},
        {
          type: "element",
          tag_name: "script",
          attrs: {src: "https://www.cognitoforms.com/f/seamless.js", "data-key": "2IOyoWKCO0eWqPqDvxZySw", "data-form": "1"}
        },
        {type: "element", tag_name: "script", content: "window.addEventListener('load',function(){Cognito.mount('1', '#form');});"}
      ]
    }
  }
});
