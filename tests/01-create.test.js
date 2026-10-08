const request = require("supertest");
let app = require("../app");

beforeEach(() => {
    jest.resetModules();
    app = require("../app");
});


describe("Del 1: Skapa polls", () => {


  test("POST /api/poll skapar en poll", async () => {
    const response = await request(app)
      .post("/api/poll")
      .send({
        question: "Best snack?",
        options: ["Chips", "Chocolate", "Fruit"]
      });

    expect(response.body).toEqual({
      message: "Poll created",
      id: 0
    });
  });
/*
  test("den skapade pollen har rätt struktur", async () => {
    await request(app)
      .post("/api/poll")
      .send({
        question: "Best snack?",
        options: ["Chips", "Chocolate", "Fruit"]
      });

    const response = await request(app).get("/api/poll/0");

    expect(response.body).toEqual({
      question: "Best snack?",
      options: [
        { text: "Chips", votes: 0 },
        { text: "Chocolate", votes: 0 },
        { text: "Fruit", votes: 0 }
      ],
      isOpen: true
    });
  });
*/
  test("flera polls får olika index", async () => {
    const first = await request(app)
      .post("/api/poll")
      .send({
        question: "First poll",
        options: ["A", "B"]
      });

    const second = await request(app)
      .post("/api/poll")
      .send({
        question: "Second poll",
        options: ["C", "D"]
      });

    expect(first.body.id).toBe(0);
    expect(second.body.id).toBe(1);
  });
});