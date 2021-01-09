import "reflect-metadata";
import supertest, { SuperTest, Test } from "supertest";
import { getManager, getRepository } from "typeorm";
import { Room } from "../entities/Room";
import { server, testDatabase } from "../index";

export function getTestApp(port: number): Promise<SuperTest<Test>> {
    return server(testDatabase, port).then((app) => supertest(app));
}

// export const cleanDatabase = async () => {
//     const roomRepo = getManager().getRepository(Room);
//     const room1 = roomRepo.findOne(0);
//     console.log(room1);
// };
