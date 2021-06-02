build_site({
  company_name: "District Visa",
  title_bar_style: "light",
  tagline_style: "light cursive",
  site_title: "District Visa",
  pages: {
    "index.html": {
      title: "Home",
      cover_images: ["img/capitol.jpg"],
      tagline: "Apostille and Document Authentication Services",
      content: [
        {
          type: "action_tiles",
          items: "pages"
        }
      ]
    },
    "contact.html": {
      title: "Contact Us",
      content: [{type: "paragraph", content: "Hello"}]
    },
    "order-form.html": {
      title: "Order Form"
    }
  }
});
