build_site({
  company_name: "District Visa",
  theme: "light",
  tagline_style: "light fofx-cursive",
  title: "District Visa",
  root: "index.html",
  email: "info@districtvisa.com",
  phone: "5719215174",
  icons: "css/line-awesome.min.css",
  include_contact: true,
  pages: {
    "index.html": {
      title: "Home",
      cover_images: ["img/capitol.jpg"],
      tagline: "Apostille and Document Authentication Services",
      content: [{type: "page_tiles"}]
    },
    "order-form.html": {
      title: "Order Form",
      content: [
        {tag: "div", id: "form", content: ["Loading..."]},
        {
          tag: "script",
          attrs: {src: "https://www.cognitoforms.com/f/seamless.js", "data-key": "2IOyoWKCO0eWqPqDvxZySw", "data-form": "1"}
        },
        {tag: "script", content: ["window.addEventListener('load',function(){Cognito.mount('1', '#form');});"]}
      ]
    }
  }
});

// <a href="https://icons8.com/icon/63598/envelope">Envelope icon by Icons8</a>
