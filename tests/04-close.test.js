const request = require("supertest");
let app = require("../app");

beforeEach(() => {
    jest.resetModules();
    app = require("../app");
});

describe("Del 4: Stänga polls", () => {
  test("POST /api/poll/:id/close stänger pollen", async () => {
    await request(app)
      .post("/api/poll")
      .send({
        question: "Best snack?",
        options: ["Chips", "Chocolate"]
      });

    const response = await request(app)
      .post("/api/poll/0/close");

    expect(response.body).toEqual({
      message: "Poll closed",
      id: 0
    });
  });

  test("en stängd poll har isOpen=false", async () => {
    await request(app)
      .post("/api/poll")
      .send({
        question: "Best snack?",
        options: ["Chips", "Chocolate"]
      });

    await request(app).post("/api/poll/0/close");

    const response = await request(app).get("/api/poll/0");

    expect(response.body.isOpen).toBe(false);
  });

  test("en stängd poll accepterar inte röster", async () => {
    await request(app)
      .post("/api/poll")
      .send({
        question: "Best snack?",
        options: ["Chips", "Chocolate"]
      });

    await request(app).post("/api/poll/0/close");

    await request(app).put("/api/vote/0?option=0");

    const response = await request(app).get("/api/poll/0");

    expect(response.body.options[0].votes).toBe(0);
  });

  test("en öppen poll accepterar röster", async () => {
    await request(app)
      .post("/api/poll")
      .send({
        question: "Best snack?",
        options: ["Chips", "Chocolate"]
      });

    await request(app).put("/api/vote/0?option=0");

    const response = await request(app).get("/api/poll/0");

    expect(response.body.options[0].votes).toBe(1);
  });
});