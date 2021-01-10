import { SuperTest, Test } from "supertest";
import { getTestApp } from "../bootstrap";
import { Room } from "../../entities/Room";

describe("Card endpoint", () => {
    let app: SuperTest<Test>;

    beforeAll(async (done) => {
        const a = await getTestApp(5005);
        app = a;

        done();
    });


    
    test("GET /rooms", () => {
        app.get("/rooms").expect(`Content-Type`, `application/json`).expect(200);
    });

    test("GET /room", () => {
        app.get("/room").expect(404);
    });
    test("GET /rooms", () => {
        app.get("/rooms").expect(`Content-Type`, `application/json`).expect(200);
    });

    test("GET /room", () => {
        app.get("/room").expect(404);
    });
    test("GET /rooms", () => {
        app.get("/rooms").expect(`Content-Type`, `application/json`).expect(200);
    });

    

    // test("GET /rooms/0", () => {
    //     app.get("/rooms/0").expect((res) => 200);
    // });

    // test("POST /rooms", () => {
    //     app.post("/rooms");
    // });

    // test("PUT /rooms/0", () => {
    //     app.put("/rooms/0");
    // });

    // test("DELETE /rooms/0", () => {
    //     app.delete("/rooms/0");
    // });
});

