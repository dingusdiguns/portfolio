const THREE = require( "three" )

let Projects = {

  "Wild One": {
    title: "WILD ONE",
    cover: "/images/wild-one.png",
    textColor: "rgb( 240, 140, 100 )",
    textColor: "rgb(240 200 170)",
    handle: "wild-one",
    linkText: "View Project",
    shortDescription: "a <strike>School</strike> Website for <strike>Ants</strike> Dogs",
    backgroundColor_rgb: "rgb(180, 170, 165)",
    backgroundColor: new THREE.Color( "rgb(180, 170, 165)" ),
    description: `The Wild One website is the product of 2 years of brand-building. Through months of iteration, we (a team of 2) designed the site modularly to house a varying amount of products. We were able to layer in functionality to allow users to parametrically customize products using a custom built 3d visulizer. This effort innevitably resulted in the founder of Wild One receiving a <a href = "https://www.forbes.com/30-under-30/2020/retail-ecommerce/#5ca8157f2fcd">Forbes 30 Under 30 Award</a> for ecommerce.`,
    images: [
      {
        carousel: true,
        images: [
          {
            src: "/images/wild-one/WO_VM_Studio_Digital_LilacLaunch_Lilac_Dog_234-Edit_NR.jpg",
            caption: 'Photographed by <a href = "https://www.samliebeskind.com/">Sam Liebeskind</a>'
          },
          {
            src: "/images/wild-one/WO_VM_Website_Treats_Collection_03_Print_NR.jpg",
            caption: 'Photographed by <a href = "https://www.samliebeskind.com/">Sam Liebeskind</a>'
          },
          {
            src: "/images/wild-one/WO_VM_Website_Leash_Harness_Navy_Editorial_02_Print_NR.jpg",
            caption: 'Photographed by <a href = "https://www.samliebeskind.com/">Sam Liebeskind</a>'
          },
          {
            src: "/images/wild-one/WO_VM_Studio_Digital_LilacLaunch_Lilac_Dog_234-Edit_NR.jpg",
            caption: 'Photographed by <a href = "https://www.samliebeskind.com/">Sam Liebeskind</a>'
          },
          {
            src: "/images/wild-one/WO_VM_Website_Treats_Collection_03_Print_NR.jpg",
            caption: 'Photographed by <a href = "https://www.samliebeskind.com/">Sam Liebeskind</a>'
          },
          {
            src: "/images/wild-one/WO_VM_Website_Leash_Harness_Navy_Editorial_02_Print_NR.jpg",
            caption: 'Photographed by <a href = "https://www.samliebeskind.com/">Sam Liebeskind</a>'
          },

        ]
      },
      "/images/wild-one/wild-one-home--big.png",
      "/images/wild-one/wild-one-pdp--blue-big.png",
      "/images/wild-one/wild-one-double-mobile.png",
    ],
    roles: [
      "UI Designer",
      "Fullstack Dev"
    ],
    technologies: [
      "ReactJs",
      "NodeJS",
      "ThreeJS",
      "Shopify",
      "Shopify Storefront API"
    ]
  },

  "Scribby": {
    title: "Scribby",
    cover: "/images/scribby.png",
    shortDescription: "generative painting for all",
    textColor: "rgb( 180, 69, 60 )",
    description: "An ecommerce site that allows users to paint like a painter. Using WebGL and HTML Canvas, it creates a series of simulations that mirror analogue painting techniques including watercolor and acrylic. In order to achieve a convincing paint effect, I had to write a custom WebGL engine as well as about a dozen shaders in GLSL.",
    handle: "scribby",
    linkText: "View Project",
    backgroundColor_rgb: "rgb(180, 69, 120)",
    backgroundColor: new THREE.Color( "rgb(27, 27, 95)" ),
    backgroundColor: new THREE.Color( "rgb(180, 180, 185)" ),
    images: [
      {
        video: true,
        src: "/images/scribby/scribby-1.m4v"
      },
      {
        video: true,
        src: "/images/scribby/scribby-portrait-2.m4v"
      }
    ],
    roles: [
      "Founder",
      "UI Designer",
      "Fullstack Dev"
    ],
    technologies: [
      "React",
      "WebGL",
      "AWS",
      "Shopify",
      "NodeJS"
    ]
  },


  "Courant": {
    title: "Courant",
    cover: "/images/courant-6.png",
    firstImage: "/images/courant/first-image--catch-3.jpg",
    textColor: "rgb( 50, 50, 120 )",
    shortDescription: "Wireless <strike>Well there is ONE wire, but it doesn't connect to your phone</strike> charging perfected",
    description: `Courant's website has gone through several iterations. It was originally built to serve as a promotional website for a single product, but as the Company's project offering changed, so did the website to fit into a more traditional mould. In it's current state, it is built to offer the client a full range of customizability; this includes: being able to create custom promotions for monogrammed products, on-the-fly discounts for custom product bundles, and a custom built tiered-discount model for the cart. Our efforts were validated in 2019 when both of the cofounders of the company received a <a href = "https://www.forbes.com/30-under-30/2021/consumer-technology/?profile=courant">Forbes 30 Under 30 Award</a> for consumer technology.`,
    handle: "courant",
    linkText: "View Project",
    backgroundColor_rgb: "rgb(180, 180, 180)",
    backgroundColor: new THREE.Color( "rgb(180, 180, 185)" ),
    backgroundColor: new THREE.Color( "rgb(150, 150, 150)" ),
    images: [
      {
        carousel: true,
        images: [
          {
            src: "/images/courant/CT_VM_x_Naked_Cashmere_Giveaway_Editorial_02_Print.jpg",
            caption: 'Photographed by <a href = "https://www.samliebeskind.com/">Sam Liebeskind</a>'
          },
          {
            src: "/images/courant/CT_VM_Saddle_WFH_Editorial_332_Print.jpg",
            caption: 'Photographed by <a href = "https://www.samliebeskind.com/">Sam Liebeskind</a>'
          },
          {
            src: "/images/courant/20_CT_VM_Carry_Catch_3_PacificBlue_Editorial_01_Print.jpg",
            caption: 'Photographed by <a href = "https://www.samliebeskind.com/">Sam Liebeskind</a>'
          },
          {
            src: "/images/courant/CT_VM_AirpodPro_Case_Editorial_105_Print.jpg",
            caption: 'Photographed by <a href = "https://www.samliebeskind.com/">Sam Liebeskind</a>'
          },
          {
            src: "/images/courant/05_CT_VM_Carry_WinterFashion_122019_Editorial_118+copy_NR.jpg",
            caption: 'Photographed by <a href = "https://www.samliebeskind.com/">Sam Liebeskind</a>'
          },
          {
            src: "/images/courant/CT_VM_x_Naked_Cashmere_Giveaway_Editorial_02_Print.jpg",
            caption: 'Photographed by <a href = "https://www.samliebeskind.com/">Sam Liebeskind</a>'
          }
        ]
      },
      "/images/courant/home-hero-render-desktop.png",
      "/images/courant/courant-mobile-home.png",
      "/images/courant/home-pdp-render-desktop.png",
      "/images/courant/courant-pdp-mobile.png",
    ],
    roles: [
      "Fullstack Dev",
      "UI Designer"
    ],
    technologies: [
      "React",
      "WebGL",
      "Ruby",
      "Liquid",
      "Shopify Storefront API"
    ]

  },




}

// Projects["WP"] = {
//   title: "W&P",
//   cover: "/images/wp.jpg",
//   handle: "wp",
//   textColor: "rgb( 255, 210, 100 )",
//   linkText: "View Project",
//   shortDescription: "<strike>Wine</strike> Williams & <strike>Puzzles</strike> Prum",
//   backgroundColor_rgb: "rgb(80, 0, 0)",
//   backgroundColor: new THREE.Color( "rgb(255, 180, 80)" ),
//   images: [],
//   roles: [
//     "Fullstack Dev",
//     "UI Designer"
//   ],
//   technologies: [
//     "react",
//   ],
// }

export default Projects
