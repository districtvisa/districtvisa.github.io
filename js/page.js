build_site({
  company_name: "District Visa",
  theme: "light",
  tagline_style: "light fofx-cursive",
  title: "District Visa",
  email: "info@districtvisa.com",
  phone: "5719215174",
  pages: {
    "home": {
      title: "Home",
      cover_images: [
        {
          src: "img/capitol.jpg",
          header: "District Visa",
          subheader: "Your one stop for Apostille Services, Document Authentication, and much more"
        }
      ],
      content: [
        {tag: "p", content: ["District Visa provides prompt and reliable document legalization, authentication and certification services."]},
        {tag: "p", content: ["We will have one of our specially trained document legalization agents hand-carry your legal documents to the DC Notary & Authentication office (if required), the State Department Authentication office and then to the appropriate Embassy."]},
        {tag: "p", content: ["District Visa specializes in making the documentation process easier and faster. Along with saving you time District Visa will provide peace of mind by staying in contact with you to let you know the status of any item you have in process with us and will notify you of any issues or delays."]},
        {tag: "h2", content: ["Four easy steps to order an apostille with District Visa for your FBI report:"]},
        {
          tag: "ul",
          content: [
            {tag: "li", content: [
              {tag: "b", content: ["Step one: "]},
              "Your first step is obtaining your FBI report or FBI background check. Contact an ",
              {type: "link", content: ["FBI Approved Channeler"], data: "?page=approved-channelers"},
              "."
            ]}
          ]
        }
      ],
      include_icons: "css/line-awesome.min.css"
    },
    "order-form": {
      title: "Order Form",
      content: [
        {tag: "div", id: "form", content: ["Loading..."]},
        {
          tag: "script",
          attrs: {src: "https://www.cognitoforms.com/f/seamless.js", "data-key": "2IOyoWKCO0eWqPqDvxZySw", "data-form": "1"}
        },
        {tag: "script", content: ["window.addEventListener('load',function(){Cognito.mount('1', '#form');});"]}
      ],
      title_bar: true,
      tile: true
    },
    "document-legalization": {
      title: "Document Legalization",
      title_bar: true,
      tile: true
    },
    "visas": {
      title: "Visas",
      title_bar: true,
      tile: true
    },
    "contact": {template: "contact", tile: false},
    "approved-channelers": {
      title: "Approved FBI Channelers",
      content: [
        {
          type: "block_list",
          data: [
            [
              "Accurate Biometrics",
              {type: "link", data: "accuratebiometrics.com", prefix: "http://"},
              {type: "phone", data: "7736855699"}
            ],
            [
              "Biometrics4All",
              {type: "link", data: "applicantservices.com", prefix: "http://"},
              {type: "phone", data: "7145689888"}
            ],
            [
              "Daon Trusted Identity Services",
              {type: "link", data: "daontis.com", prefix: "http://"},
              {type: "phone", data: "7037972562"}
            ]
          ]
        }
      ]
    }
  }
});

// <a href="https://icons8.com/icon/63598/envelope">Envelope icon by Icons8</a>
