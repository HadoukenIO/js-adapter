import { connect, Fin } from "../src/main";

let c: Promise<Fin>;
export function conn() {
    if (!c) {
        c = connect({
            address: "ws://localhost:9696",
            uuid: "example_uuid" + Math.random()
        });
    }

    return c;
};
