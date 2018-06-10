'use strict';

class Book {
      constructor(SKU, name, manufactorer, author, price,
            viewed, pulish_date, remain_count, price_import, type) {
            this.SKU = SKU;
            this.name = name;
            this.manufactorer = manufactorer;
            this.author = author;
            this.price = price;
            this.viewed = viewed;
            this.pulish_date = pulish_date;
            this.remain_count = remain_count;
            this.price_import = price_import;
            this.type = type;
      }

      get getSKU() {
            return this.SKU;
      }

      get getname() {
            return this.name;
      }
      get getmanufactorer() {
            return this.manufactorer;
      }

      get getauthor() {
            return this.author;
      }

      get getprice() {
            return this.price;
      }

      get getviewed() {
            return this.viewed;
      }

      get getpulish_date() {
            return this.pulish_date;
      }

      get getremain_count() {
            return this.remain_count;
      }

      get getprice_import() {
            return this.price_import;
      }

      get gettype() {
            return this.type;
      }
}

module.exports = Book;