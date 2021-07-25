build_site({
  company_name: "District Visa",
  theme: "light",
  tagline_style: "light fofx-cursive",
  title: "District Visa",
  root: "index.html",
  email: "info@districtvisa.com",
  phone: "5719215174",
  pages: {
    "index.html": {
      title: "Home",
      cover_images: [
        {
          src: "img/capitol.jpg",
          header: "District Visa",
          subheader: "Apostille and Document Authentication Services"
        }
      ],
      include_icons: "css/line-awesome.min.css"
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
      ],
      title_bar: true
    },
    "contact.html": {template: "contact"}
  }
});

// <a href="https://icons8.com/icon/63598/envelope">Envelope icon by Icons8</a>
