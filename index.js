import axios from "axios";
import * as cheerio from "cheerio";
import ObjectsToCsv from "objects-to-csv";

//Extracting HTML Document

try {
  const HTTPResponse = await axios.get("https://books.toscrape.com/");
  var HTMLDoc = HTTPResponse.data;
} catch (error) {
  console.error("Error fetching the HTML document", error);
}

const $ = cheerio.load(HTMLDoc);

//Extracting HTML elements

const Titles = $(".product_pod h3 a");
const Prices = $(".product_pod .price_color");
const Ratings = $(".product_pod .star-rating");

//Storing the extracetd data in an array of objects

var Books = [];

for (let index = 0; index < Titles.length; index++) {
  const book = {
    Title: Titles[index].attribs.title,
    Price: Prices[index].children[0].data,
    Rating: Ratings[index].attribs.class.substring(12) + " stars",
  };

  Books.push(book);
}

//Converting the array of objects into a CSV format

try {
  new ObjectsToCsv(Books).toDisk("./books.csv");
} catch (error) {
  console.error("Error converting array to CSV file", error);
}
