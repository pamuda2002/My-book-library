import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import request from "supertest";
import assert from "assert";
import { describe, it, mock, before, after } from "node:test";
import esmock from "esmock";

describe("POST /delete", () => {
    let app;
    let mockQuery;

    before(async () => {
        // Create a mock query function
        mockQuery = mock.fn(async (text, params) => {
            return { rows: [] };
        });

        // Mock pg.Client
        const MockClient = class {
            constructor() {
                this.query = mockQuery;
                this.connect = async () => {};
            }
        };

        // Use esmock to import the app with the mocked pg dependency
        app = await esmock("../index.js", {
            pg: {
                Client: MockClient
            }
        });

        // esmock returns the module namespace, so we need the default export
        app = app.default;
    });

    it("should extract bookId correctly from body and call db.query", async () => {
        await request(app)
            .post("/delete")
            .type("form")
            .send({ bookId: "123" })
            .expect(302);

        assert.strictEqual(mockQuery.mock.calls.length, 1);
        const args = mockQuery.mock.calls[0].arguments;
        assert.ok(args[0].includes("DELETE FROM books"));
        assert.strictEqual(args[1][0], "123");
    });
});
