const request = require("supertest");

let app;

beforeEach(() => {
  jest.resetModules();
  app = require("../app");
});

describe("Extra: HTTP status codes", () => {
  test("POST /api/poll returns 201 when a poll is created", async () => {
    const response = await request(app)
      .post("/api/poll")
      .send({
        question: "Best snack?",
        options: ["Chips", "Chocolate", "Fruit"]
      });

    expect(response.status).toBe(201);
  });

  test("GET /api/poll returns 200", async () => {
    const response = await request(app)
      .get("/api/poll");

    expect(response.status).toBe(200);
  });

  test("GET /api/poll/:id returns 200", async () => {
    await request(app)
      .post("/api/poll")
      .send({
        question: "Best snack?",
        options: ["Chips", "Chocolate", "Fruit"]
      });

    const response = await request(app)
      .get("/api/poll/0");

    expect(response.status).toBe(200);
  });

  test("PUT /api/vote/:id returns 200", async () => {
    await request(app)
      .post("/api/poll")
      .send({
        question: "Best snack?",
        options: ["Chips", "Chocolate", "Fruit"]
      });

    const response = await request(app)
      .put("/api/vote/0?option=1");

    expect(response.status).toBe(200);
  });

  test("POST /api/poll/:id/close returns 200", async () => {
    await request(app)
      .post("/api/poll")
      .send({
        question: "Best snack?",
        options: ["Chips", "Chocolate", "Fruit"]
      });

    const response = await request(app)
      .post("/api/poll/0/close");

    expect(response.status).toBe(200);
  });

  test("GET /api/poll/:id/winner returns 200", async () => {
    await request(app)
      .post("/api/poll")
      .send({
        question: "Best snack?",
        options: ["Chips", "Chocolate", "Fruit"]
      });

    const response = await request(app)
      .get("/api/poll/0/winner");

    expect(response.status).toBe(200);
  });

  test("DELETE /api/poll/:id returns 200", async () => {
    await request(app)
      .post("/api/poll")
      .send({
        question: "Best snack?",
        options: ["Chips", "Chocolate", "Fruit"]
      });

    const response = await request(app)
      .delete("/api/poll/0");

    expect(response.status).toBe(200);
  });

  test("GET /api/poll/:id returns 404 for a poll that does not exist", async () => {
    const response = await request(app)
      .get("/api/poll/999");

    expect(response.status).toBe(404);
  });

  test("PUT /api/vote/:id returns 404 for a poll that does not exist", async () => {
    const response = await request(app)
      .put("/api/vote/999?option=0");

    expect(response.status).toBe(404);
  });

  test("POST /api/poll/:id/close returns 404 for a poll that does not exist", async () => {
    const response = await request(app)
      .post("/api/poll/999/close");

    expect(response.status).toBe(404);
  });

  test("GET /api/poll/:id/winner returns 404 for a poll that does not exist", async () => {
    const response = await request(app)
      .get("/api/poll/999/winner");

    expect(response.status).toBe(404);
  });

  test("DELETE /api/poll/:id returns 404 for a poll that does not exist", async () => {
    const response = await request(app)
      .delete("/api/poll/999");

    expect(response.status).toBe(404);
  });
});