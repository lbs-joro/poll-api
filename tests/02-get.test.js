const request = require("supertest");
let app = require("../app");

beforeEach(() => {
    jest.resetModules();
    app = require("../app");
});

describe("Del 2: Hämta polls", () => {
  test("GET /api/poll returnerar en array", async () => {
    const response = await request(app).get("/api/poll");

    expect(Array.isArray(response.body)).toBe(true);
  });

  test("GET /api/poll returnerar skapade polls", async () => {
    await request(app)
      .post("/api/poll")
      .send({
        question: "Best snack?",
        options: ["Chips", "Chocolate", "Fruit"]
      });

    await request(app)
      .post("/api/poll")
      .send({
        question: "Best language?",
        options: ["JavaScript", "Python"]
      });

    const response = await request(app).get("/api/poll");

    expect(response.body).toHaveLength(2);

    expect(response.body[0].question).toBe("Best snack?");
    expect(response.body[1].question).toBe("Best language?");
  });

  test("GET /api/poll/:id returnerar rätt poll", async () => {
    await request(app)
      .post("/api/poll")
      .send({
        question: "First poll",
        options: ["A", "B"]
      });

    await request(app)
      .post("/api/poll")
      .send({
        question: "Second poll",
        options: ["C", "D"]
      });

    const response = await request(app).get("/api/poll/1");

    expect(response.body.question).toBe("Second poll");
    expect(response.body.options).toEqual([
      { text: "C", votes: 0 },
      { text: "D", votes: 0 }
    ]);
    expect(response.body.isOpen).toBe(true);
  });
});