import { defaultStatusCode } from "./http-status-code";
import { HttpStatusCode } from "./http-status-code";

describe("defaultStatusCode", () => {
    it("should return Ok for GET", () => {
        expect(defaultStatusCode("GET")).toBe(HttpStatusCode.Ok);
    });

    it("should be case insensitive", () => {
        expect(defaultStatusCode("get")).toBe(HttpStatusCode.Ok);
        expect(defaultStatusCode("GeT")).toBe(HttpStatusCode.Ok);
    });

    it("should return Created for POST", () => {
        expect(defaultStatusCode("POST")).toBe(HttpStatusCode.Created);
    });

    it("should return Ok for PUT", () => {
        expect(defaultStatusCode("PUT")).toBe(HttpStatusCode.Ok);
    });

    it("should return NoContent for DELETE", () => {
        expect(defaultStatusCode("DELETE")).toBe(HttpStatusCode.NoContent);
    });

    it("should return Ok for unknown methods", () => {
        expect(defaultStatusCode("PATCH")).toBe(HttpStatusCode.Ok);
        expect(defaultStatusCode("OPTIONS")).toBe(HttpStatusCode.Ok);
        expect(defaultStatusCode("HEAD")).toBe(HttpStatusCode.Ok);
    });
});