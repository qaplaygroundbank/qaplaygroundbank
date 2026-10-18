
import request from "supertest";
import { expect } from "chai";
import config from "../config/apiproject.config.js";

// Use the centrally configured API base URL.
const api = request(config.baseUrl);

describe("JSONPlaceholder Posts API - CRUD Demo", function () {
    this.timeout(10000);

    let createdPostId;

    it("@smoke @regression CREATE: POST /posts should create a post", async function () {
        const payload = {
            title: "SuperTest team demo",
            body: "CRUD API automation using Mocha and Chai",
            userId: 1
        };

        const response = await api
            .post("/posts")
            .set("Content-Type", "application/json")
            .send(payload);

        expect(response.status).to.equal(201);
        expect(response.body).to.include(payload);
        expect(response.body).to.have.property("id");

        createdPostId = response.body.id;
        console.log(`Created simulated post id: ${createdPostId}`);
    });

    it("@smoke @regression READ: GET /posts/1 should return one post", async function () {
        const response = await api.get("/posts/1");

        expect(response.status).to.equal(200);
        expect(response.headers["content-type"]).to.match(/json/);
        expect(response.body).to.include({ id: 1, userId: 1 });
        expect(response.body.title).to.be.a("string").and.not.empty;
        expect(response.body.body).to.be.a("string").and.not.empty;
    });

    it("@regression UPDATE: PUT /posts/1 should replace the post", async function () {
        const payload = {
            id: 1,
            title: "Updated SuperTest demo",
            body: "The post was updated using PUT",
            userId: 1
        };

        const response = await api.put("/posts/1").send(payload);

        expect(response.status).to.equal(200);
        expect(response.body).to.deep.equal(payload);
    });

    it("@regression DELETE: DELETE /posts/1 should delete a post", async function () {
        const response = await api.delete("/posts/1");

        expect(response.status).to.equal(200);
        expect(response.body).to.deep.equal({});
    });

    it("@negative @regression NEGATIVE: GET /posts/999999 should return 404", async function () {
        const response = await api.get("/posts/999999");

        expect(response.status).to.equal(404);
        expect(response.body).to.deep.equal({});
    });

    it("@smoke @regression Simple Header Validation", async function () {
        const response = await api.get("/posts/2");

        expect(response.headers["content-type"]).to.contain("application/json");
        expect(response.headers).to.have.property("content-type");
    });
});
