const {
    fetchDOM,
    parseDomForProductLinks,
    parseDomForProductDetails,
  } = require("./fetchDataFromSnapdeal");
  
  const main = async (page) => {
    const productData = [];
    const baseURL = `https://www.snapdeal.com/acors/json/product/get/search/0/${page}/20?q=&keyword=tshirt`;
    const DOM = await fetchDOM(baseURL);
    const productLinks = await parseDomForProductLinks(DOM);
    for (let i of productLinks) {
      const productDom = await fetchDOM(i);
      const data = await parseDomForProductDetails(productDom);
      productData.push(data);
    }
    console.log(productData);
  };
  
  main(1);