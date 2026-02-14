
const http = require("http");
const app = require("../app");

let server;
const PORT = 3000;
const BASE_URL = `http://127.0.0.1:${PORT}`;

function getJSON(path) {
  return new Promise((resolve, reject) => {
    http
      .get(BASE_URL + path, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          resolve({
            statusCode: res.statusCode,
            body: data ? JSON.parse(data) : null,
          });
        });
      })
      .on("error", reject);
  });
}

beforeAll((done) => {
  server = app.listen(PORT, done);
});

afterAll((done) => {
  server.close(done);
});

test("✅ /sistema devuelve Mercurio, Venus y Tierra con sus lunas", async () => {
  const esperado = [
    { nombre: "Mercurio", tipo: "Rocoso", lunas: [] },
    { nombre: "Venus", tipo: "Rocoso", lunas: [] },
    { nombre: "Tierra", tipo: "Rocoso", lunas: ["Luna"] },
  ];

  const res = await getJSON("/sistema?planetas=mercurio,venus,tierra");
  expect(res.statusCode).toBe(200);
  expect(res.body).toEqual(esperado); // estricto
});
