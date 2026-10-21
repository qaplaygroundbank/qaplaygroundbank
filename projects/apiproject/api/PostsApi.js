import BaseApi from "./BaseApi.js";

class PostsApi extends BaseApi {

    constructor() {
        super();
        this.postsEndpoint = "/posts";
    }

    async getAllPosts() {
        return await this.get(this.postsEndpoint);
    }

    async getPostById(postId) {
        return await this.get(
            `${this.postsEndpoint}/${postId}`
        );
    }

    async getPostsByUserId(userId) {
        return await this.get(
            `${this.postsEndpoint}?userId=${userId}`
        );
    }

    async createPost(postData) {
        return await this.post(
            this.postsEndpoint,
            postData
        );
    }

    async updatePost(postId, postData) {
        return await this.put(
            `${this.postsEndpoint}/${postId}`,
            postData
        );
    }

    async patchPost(postId, postData) {
        return await this.patch(
            `${this.postsEndpoint}/${postId}`,
            postData
        );
    }

    async deletePost(postId) {
        return await this.delete(
            `${this.postsEndpoint}/${postId}`
        );
    }
}

export default PostsApi;