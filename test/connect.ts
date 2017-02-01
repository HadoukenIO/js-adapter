import { connect } from "../src/main";

let c;
export function conn() {
    if (!c) {
        c = connect({
        address: "ws://localhost:9696",
        uuid: "example_uuid" + Math.random()
        });
    }

    return c;
};
