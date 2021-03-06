class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    // 1A) Filtering
    const queryObject = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObject[el]);

    // 1B) AdvanceFiltering
    let queryStr = JSON.stringify(queryObject);
    queryStr = JSON.parse(
      queryStr.replace(/\b(gte|gt|lte|lt|eq|ne)\b/g, (match) => `$${match}`)
    );

    // Not able to use sort(),limit() etc...
    // const teachers =  await Teacher.find(queryObject);
    this.query = this.query.find(queryStr);
    // let query = Teacher.find(queryStr);
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    //page=2&limit=10 1-10 page 1, 11-20 page 2...
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
