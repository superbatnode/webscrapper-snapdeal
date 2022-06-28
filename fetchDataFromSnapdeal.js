const axios = require("axios");
const cheerio = require("cheerio");

const fetchDOM = (url) => {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => resolve(response.data))
      .catch((e) => reject(e));
  });
};

const parseDomForProductLinks = (html) => {
  return new Promise((resolve, reject) => {
    const $ = cheerio.load(html);
    const data = $(
      "div.product-tuple-description > div.product-desc-rating > a"
    );
    if (data.length <= 0) reject("No Links found");
    const list = [];
    data.each(function (index, element) {
      list.push($(element).attr("href"));
    });
    resolve(list);
  });
};

const parseDomForProductDetails = (html) => {
  return new Promise((resolve, reject) => {
    const $ = cheerio.load(html);
    const productDetails = {};
    productDetails.title = $(".pdp-e-i-head").attr("title");
    if (productDetails.title === undefined) reject("doesn't have any data");
    productDetails.price = $(
      "#buyPriceBox > div.row.reset-margin > div.col-xs-14.reset-padding.padL8 > div.disp-table > div.pdp-e-i-PAY-r.disp-table-cell.lfloat > span.pdp-final-price"
    ).text();
    productDetails.rating = {};
    productDetails.rating.overall = $(".avrg-rating").text();
    productDetails.rating.ratings = $(".total-rating").text();
    productDetails.rating.reviews = $(".numbr-review>a").text();
    productDetails.colorAndSizesAvailable = [];
    $(".attr-val").each((idx, el) => {
      productDetails.colorAndSizesAvailable.push($(el).text());
    });
    productDetails.highlights = [];
    $(".dtls-li > span.h-content").each((idx, list) => {
      productDetails.highlights.push($(list).text());
    });
    productDetails.description = $(
      "#id-tab-container > div > div:nth-child(3) > div.spec-body > div"
    )
      .text()
      .trim();
    productDetails.image = $(
      "#bx-slider-left-image-panel > li:nth-child(1) > img"
    ).attr("src");
    resolve(productDetails);
  });
};
module.exports = {
  fetchDOM,
  parseDomForProductDetails,
  parseDomForProductLinks,
};
