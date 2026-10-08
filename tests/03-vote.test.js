const request = require("supertest");
let app = require("../app");

beforeEach(() => {
    jest.resetModules();
    app = require("../app");
});

describe("Del 3: Rösta på polls", () => {
  test("PUT /api/vote/:id registrerar en röst", async () => {
    const createResponse = await request(app)
      .post("/api/poll")
      .send({
        question: "Best snack?",
        options: ["Chips", "Chocolate", "Fruit"]
      });

    const response = await request(app)
      .put(`/api/vote/${createResponse.body.id}?option=1`);

    expect(response.body).toEqual({
      message: "Vote registered",
      id: 0
    });
  });

  test("rösten ökar röstantalet för rätt alternativ", async () => {
    await request(app)
      .post("/api/poll")
      .send({
        question: "Best snack?",
        options: ["Chips", "Chocolate", "Fruit"]
      });

    await request(app).put("/api/vote/0?option=1");

    const response = await request(app).get("/api/poll/0");

    expect(response.body.options[0].votes).toBe(0);
    expect(response.body.options[1].votes).toBe(1);
    expect(response.body.options[2].votes).toBe(0);
  });

  test("alternativ 0 kan få en röst", async () => {
    await request(app)
      .post("/api/poll")
      .send({
        question: "Best language?",
        options: ["JavaScript", "Python", "C#"]
      });

    await request(app).put("/api/vote/0?option=0");

    const response = await request(app).get("/api/poll/0");

    expect(response.body.options[0].votes).toBe(1);
    expect(response.body.options[1].votes).toBe(0);
    expect(response.body.options[2].votes).toBe(0);
  });

  test("flera röster kan registreras", async () => {
    await request(app)
      .post("/api/poll")
      .send({
        question: "Best language?",
        options: ["JavaScript", "Python"]
      });

    await request(app).put("/api/vote/0?option=0");
    await request(app).put("/api/vote/0?option=0");
    await request(app).put("/api/vote/0?option=1");

    const response = await request(app).get("/api/poll/0");

    expect(response.body.options[0].votes).toBe(2);
    expect(response.body.options[1].votes).toBe(1);
  });
});