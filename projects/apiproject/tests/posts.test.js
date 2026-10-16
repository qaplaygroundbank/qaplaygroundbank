import { expect } from "chai";
import PostsApi from "../api/PostsApi.js";
import postData from "../testdata/postData.js";

describe("JSONPlaceholder Posts API - POM Framework", function () {

    const postsApi = new PostsApi();

    describe("GET Operations", function () {

        it("should get all posts", async function () {

            const response = await postsApi.getAllPosts();

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an("array");
            expect(response.body.length).to.be.greaterThan(0);

            console.log("Total Posts:", response.body.length);
        });


        it("should get post by ID", async function () {

            const postId = 1;

            const response = await postsApi.getPostById(postId);

            expect(response.status).to.equal(200);
            expect(response.body.id).to.equal(postId);
            expect(response.body).to.have.property("title");
            expect(response.body).to.have.property("body");
            expect(response.body).to.have.property("userId");

            console.log("Post:", response.body);
        });


        it("should get posts by User ID", async function () {

            const userId = 1;

            const response =
                await postsApi.getPostsByUserId(userId);

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an("array");
            expect(response.body.length).to.be.greaterThan(0);

            response.body.forEach(post => {
                expect(post.userId).to.equal(userId);
            });

            console.log(
                `Total posts for User ${userId}:`,
                response.body.length
            );
        });

    });


    describe("POST Operation", function () {

        it("should create a new post", async function () {

            const response =
                await postsApi.createPost(postData.newPost);

            expect(response.status).to.equal(201);

            expect(response.body.title)
                .to.equal(postData.newPost.title);

            expect(response.body.body)
                .to.equal(postData.newPost.body);

            expect(response.body.userId)
                .to.equal(postData.newPost.userId);

            expect(response.body)
                .to.have.property("id");

            console.log("Created Post:", response.body);
        });

    });


    describe("PUT Operation", function () {

        it("should update an existing post", async function () {

            const postId = 1;

            const response =
                await postsApi.updatePost(
                    postId,
                    postData.updatePost
                );

            expect(response.status).to.equal(200);

            expect(response.body.id)
                .to.equal(postId);

            expect(response.body.title)
                .to.equal(postData.updatePost.title);

            console.log("Updated Post:", response.body);
        });

    });


    describe("PATCH Operation", function () {

        it("should partially update a post", async function () {

            const postId = 1;

            const response =
                await postsApi.patchPost(
                    postId,
                    postData.patchPost
                );

            expect(response.status).to.equal(200);

            expect(response.body.title)
                .to.equal(postData.patchPost.title);

            console.log("Patched Post:", response.body);
        });

    });


    describe("DELETE Operation", function () {

        it("should delete a post", async function () {

            const postId = 1;

            const response =
                await postsApi.deletePost(postId);

            expect(response.status).to.equal(200);

            console.log(
                `Post ${postId} delete request successful`
            );
        });

    });

});