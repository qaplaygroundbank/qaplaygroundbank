import request from "supertest";
import config from "../config/apiproject.config.js";

class BaseApi {

    constructor() {
        this.request = request(config.baseUrl);
    }

    async get(endpoint) {
        return await this.request.get(endpoint);
    }

    async post(endpoint, body) {
        return await this.request
            .post(endpoint)
            .send(body);
    }

    async put(endpoint, body) {
        return await this.request
            .put(endpoint)
            .send(body);
    }

    async patch(endpoint, body) {
        return await this.request
            .patch(endpoint)
            .send(body);
    }

    async delete(endpoint) {
        return await this.request.delete(endpoint);
    }
}

export default BaseApi;