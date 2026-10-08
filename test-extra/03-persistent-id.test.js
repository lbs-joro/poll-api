const request = require("supertest");

let app;

beforeEach(() => {
  jest.resetModules();
  app = require("../app");
});

describe("Extra: persistent poll IDs", () => {
  test("created poll has an id field", async () => {
    const response = await request(app)
      .post("/api/poll")
      .send({
        question: "Best snack?",
        options: ["Chips", "Chocolate", "Fruit"]
      });

    expect(response.body).toHaveProperty("id");
  });

  test("different polls get different IDs", async () => {
    const first = await request(app)
      .post("/api/poll")
      .send({
        question: "First poll?",
        options: ["A", "B"]
      });

    const second = await request(app)
      .post("/api/poll")
      .send({
        question: "Second poll?",
        options: ["C", "D"]
      });

    expect(first.body.id).not.toBe(second.body.id);
  });

  test("poll can be retrieved using its persistent ID", async () => {
    const created = await request(app)
      .post("/api/poll")
      .send({
        question: "Best snack?",
        options: ["Chips", "Chocolate", "Fruit"]
      });

    const id = created.body.id;

    const response = await request(app)
      .get(`/api/poll/${id}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(id);
    expect(response.body.question).toBe("Best snack?");
  });

  test("deleting a poll does not change another poll's ID", async () => {
    const first = await request(app)
      .post("/api/poll")
      .send({
        question: "First poll?",
        options: ["A", "B"]
      });

    const second = await request(app)
      .post("/api/poll")
      .send({
        question: "Second poll?",
        options: ["C", "D"]
      });

    const secondId = second.body.id;

    await request(app)
      .delete(`/api/poll/${first.body.id}`);

    const response = await request(app)
      .get(`/api/poll/${secondId}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(secondId);
    expect(response.body.question).toBe("Second poll?");
  });

  test("poll can still be voted on using its persistent ID after another poll is deleted", async () => {
    const first = await request(app)
      .post("/api/poll")
      .send({
        question: "First poll?",
        options: ["A", "B"]
      });

    const second = await request(app)
      .post("/api/poll")
      .send({
        question: "Second poll?",
        options: ["C", "D"]
      });

    const secondId = second.body.id;

    await request(app)
      .delete(`/api/poll/${first.body.id}`);

    const voteResponse = await request(app)
      .put(`/api/vote/${secondId}?option=0`);

    expect(voteResponse.status).toBe(200);

    const pollResponse = await request(app)
      .get(`/api/poll/${secondId}`);

    expect(pollResponse.body.options[0].votes).toBe(1);
  });

  test("persistent ID is returned by GET /api/poll/:id", async () => {
    const created = await request(app)
      .post("/api/poll")
      .send({
        question: "Best snack?",
        options: ["Chips", "Chocolate", "Fruit"]
      });

    const response = await request(app)
      .get(`/api/poll/${created.body.id}`);

    expect(response.body).toHaveProperty("id", created.body.id);
  });
});