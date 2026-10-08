const request = require("supertest");

let app;

beforeEach(() => {
  jest.resetModules();
  app = require("../app");
});

describe("Extra: validation", () => {
  test("POST /api/poll rejects a request without a question", async () => {
    const response = await request(app)
      .post("/api/poll")
      .send({
        options: ["Chips", "Chocolate", "Fruit"]
      });

    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(response.body).toHaveProperty("error");
  });

  test("POST /api/poll rejects a request without options", async () => {
    const response = await request(app)
      .post("/api/poll")
      .send({
        question: "Best snack?"
      });

    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(response.body).toHaveProperty("error");
  });

  test("GET /api/poll/:id rejects a poll id that does not exist", async () => {
    const response = await request(app).get("/api/poll/999");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
  });

  test("PUT /api/vote/:id rejects a poll id that does not exist", async () => {
    const response = await request(app)
      .put("/api/vote/999?option=0");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
  });

  test("PUT /api/vote/:id rejects an option that does not exist", async () => {
    await request(app)
      .post("/api/poll")
      .send({
        question: "Best snack?",
        options: ["Chips", "Chocolate", "Fruit"]
      });

    const response = await request(app)
      .put("/api/vote/0?option=99");

    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(response.body).toHaveProperty("error");
  });

  test("POST /api/poll/:id/close rejects a poll id that does not exist", async () => {
    const response = await request(app)
      .post("/api/poll/999/close");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
  });

  test("GET /api/poll/:id/winner rejects a poll id that does not exist", async () => {
    const response = await request(app)
      .get("/api/poll/999/winner");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
  });

  test("DELETE /api/poll/:id rejects a poll id that does not exist", async () => {
    const response = await request(app)
      .delete("/api/poll/999");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
  });
});