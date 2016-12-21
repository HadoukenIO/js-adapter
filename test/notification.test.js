const { describe, it } = require("mocha"),
    should = require("should"),
    connect = require("./connect"),
    { Identity } = require("../."), 
    id = "adapter-test-window";

describe("Notification", () => {
    let fin, imag, real, notification;

    before(() => {
        return connect().then(_fin => {
            fin = _fin;
            notification = fin.Notification.create();
        })
    })

    describe("shape - instance", () => {
        it("should have a sendMessage method", () => {
            should(notification.sendMessage).be.Function()
        })

        it("should have a close method", () => {
            should(notification.sendMessage).be.Function()
        })
    })

})     