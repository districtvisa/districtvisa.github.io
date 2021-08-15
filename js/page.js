build_site({
  company_name: "District Visa",
  theme: "light",
  tagline_style: "light fofx-cursive",
  title: "District Visa",
  email: "info@districtvisa.com",
  phone: "5719215174",
  breakpoint: 700,
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
        {
          tag: "p",
          content: [
            {tag: "b", content: ["District Visa "]},
            "provides prompt and reliable document legalization, authentication and certification services."
          ]
        },
        {tag: "p", content: ["We will have one of our specially trained document legalization agents hand-carry your legal documents to the DC Notary & Authentication office (if required), the State Department Authentication office and then to the appropriate Embassy."]},
        {tag: "p", content: ["District Visa specializes in making the documentation process easier and faster. Along with saving you time District Visa will provide peace of mind by staying in contact with you to let you know the status of any item you have in process with us and will notify you of any issues or delays."]},
        {tag: "h2", content: ["Four easy steps to order an apostille with District Visa for your FBI report:"]},
        {
          type: "ol",
          data: [
            ["Obtain your FBI report or FBI background check. Contact an FBI Approved Channeler."],
            ["The FBI Channeler will email you your background check results in PDF format."],
            ["Download and save the PDF file."],
            [
              "Place your ",
              {type: "link", data: "?page=order-form", content: ["FBI apostille order here"]},
              "."
            ]
          ]
        },
        {tag: "h2", content: ["First thing every morning:"]},
        {tag: "p", content: ["We process FBI apostilles. We hand-deliver and submit your FBI background check directly to the US Department of State."]},
        {tag: "h2", content: ["Turnover:"]},
        {tag: "p", content: ["Your background check will be apostilled in 5 business days* from the date of submission."]},
        {tag: "p", content: ["*COVID-19 Update: The turnaround time is 3-4 weeks."]},
        {tag: "h2", content: ["Send PDF:"]},
        {tag: "p", content: ["No need to send your original report. Simply upload the PDF file you received from your channeler."]},
        {tag: "h2", content: ["Guarantee:"]},
        {tag: "p", content: ["Your satisfaction is 100% guaranteed. If we cannot obtain an apostille for your FBI criminal background check, we will refund your money 100%."]},
        {tag: "p", content: ["We apostille hundreds of FBI background checks every week. We will make sure your forms are filled correctly, go to the right government office, and that you get your documents back on time. If you are planning on working, living, adopting, getting married, or obtaining dual citizenship in a foreign country, you will need to provide an Apostille on an FBI Criminal Background Check. We expedite the process by hand-carrying each report to the U.S. Department of State, where we request Apostilles in person. We can obtain the apostille in 5 days from the day we receive your online order."]},
        {tag: "h2", content: ["Shipping fees:"]},
        {
          type: "ul",
          data: [
            ["USPS Domestic regular shipping is FREE."],
            ["Overnight shipping (FedEx) is $30."],
            ["International shipping is available for a flat fee of $45."]
          ]
        },
        {tag: "h2", content: ["Special considerations:"]},
        {
          type: "ul",
          data: [
            ["If your FBI is password protected, please type the password in the special notes section when you place the order."],
            ["If you only received a hard copy of your background report by regular mail (in paper form) you will need to mail this document to our office for processing."]
          ]
        }
      ]
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
    "contact": {template: "contact", tile: false}
  }
});

// <a href="https://icons8.com/icon/63598/envelope">Envelope icon by Icons8</a>
