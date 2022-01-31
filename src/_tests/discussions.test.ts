/// <reference types="jest" />
import {canHandleRequest, extractNPMReference} from "../discussions-trigger";

describe(canHandleRequest, () => {
    const eventActions = [
        ["discussion", "created", true],
        ["discussion", "edited", true],
        ["discussion", "updated", false],
        ["pull_request", "created", false]
    ] as const;

    test.concurrent.each(eventActions)("(%s, %s) is %s", async (event, action, expected) => {
        expect(canHandleRequest(event, action)).toEqual(expected);
    });
});

describe(extractNPMReference, () => {
    const eventActions = [
        ["[es] my thingy", "es"],
        ["OK [fr]", "fr"],
        ["I  think [sv] need improving ", "sv"],
        ["[en] needs X", "en"],
    ] as const;

    test.concurrent.each(eventActions)("(%s, %s) is %s", async (title, result) => {
        expect(extractNPMReference({ title })).toEqual(result);
    });
});
