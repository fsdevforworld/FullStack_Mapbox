let chai = require("chai");
let chaiHttp = require("chai-http");
let app = require("../app");
let should = chai.should();

chai.use(chaiHttp);
/*
 * Test the /GET route
 */
describe("/GET", () => {
  it("it should GET the region", (done) => {
    chai
      .request(app)
      .get("/api/getregion")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("center");
        res.body.should.have.property("bound");
        done();
      });
  });
  it("it should GET the coordinates", (done) => {
    chai
      .request(app)
      .get(
        "/api/coordinate?longitude1=-90&latitude1=35&longitude2=-89&latitude2=36"
      )
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("result");
        done();
      });
  });
});
