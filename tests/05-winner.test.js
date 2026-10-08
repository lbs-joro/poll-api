const request = require("supertest");
let app = require("../app");

beforeEach(() => {
    jest.resetModules();
    app = require("../app");
});
describe("Del 5: Vinnande alternativ", () => {
  test("GET /api/poll/:id/winner returnerar alternativet med flest röster", async () => {
    await request(app)
      .post("/api/poll")
      .send({
        question: "Best snack?",
        options: ["Chips", "Chocolate", "Fruit"]
      });

    await request(app).put("/api/vote/0?option=1");
    await request(app).put("/api/vote/0?option=1");
    await request(app).put("/api/vote/0?option=0");

    const response = await request(app)
      .get("/api/poll/0/winner");

    expect(response.body).toEqual({
      text: "Chocolate",
      votes: 2
    });
  });

  test("det första alternativet kan vinna", async () => {
    await request(app)
      .post("/api/poll")
      .send({
        question: "Best language?",
        options: ["JavaScript", "Python", "C#"]
      });

    await request(app).put("/api/vote/0?option=0");
    await request(app).put("/api/vote/0?option=0");

    const response = await request(app)
      .get("/api/poll/0/winner");

    expect(response.body).toEqual({
      text: "JavaScript",
      votes: 2
    });
  });

  test("vinnaren kan vara det sista alternativet", async () => {
    await request(app)
      .post("/api/poll")
      .send({
        question: "Best fruit?",
        options: ["Apple", "Banana", "Orange"]
      });

    await request(app).put("/api/vote/0?option=2");
    await request(app).put("/api/vote/0?option=2");
    await request(app).put("/api/vote/0?option=2");

    const response = await request(app)
      .get("/api/poll/0/winner");

    expect(response.body).toEqual({
      text: "Orange",
      votes: 3
    });
  });
});