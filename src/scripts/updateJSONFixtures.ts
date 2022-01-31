import {readdirSync, readFileSync, writeFileSync} from "fs";
import { join } from "path";

// Converts Travis response to GH Actions response, left
// around so that someone whio needs to edit fixtures can start from
// an existing framework

//  yarn ts-node src/scripts/updateJSONFixtures.ts

const fixtureRoot = join(__dirname, "..",  "_tests", "fixtures");
const fixtureNames = readdirSync(fixtureRoot);

fixtureNames.forEach(fixture => {
    const responsePath = join(fixtureRoot, fixture, "_response.json");
    const response = JSON.parse(readFileSync(responsePath, "utf8"));
    const pr = response.data.repository.pullRequest;
    const headSha =  pr.headRefOid;

    if (!pr.commits) return;

    const headCommit = pr.commits.nodes.find((c: any) => c.commit.oid === headSha).commit;
    const status = headCommit.status && headCommit.status.state || "MISSING";

    if (!headCommit.checkSuites) headCommit.checkSuites = { nodes: [] };
    headCommit.checkSuites.nodes.push({
        "app": {
            "name": "GitHub Actions",
            "__typename": "App",
        },
        "conclusion": status,
        "resourcePath": "/OfficialPawBot/language/commit/514e20426039035ea23c35665cf02e5d897df4c1/checks?check_suite_id=4994604855",
        "status": status,
        "url": "https://github.com/OfficialPawBot/language/commit/514e20426039035ea23c35665cf02e5d897df4c1/checks?check_suite_id=4994604855",
        "__typename": "CheckSuite",
    });

    writeFileSync(responsePath, JSON.stringify(response, null, "  ") + "\n", "utf8");
});
