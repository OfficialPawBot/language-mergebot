export async function getMonthlyDownloadCount(packageName: string): Promise<number> {
    // use the month up to a week before the given date, in case it takes npm some time to update the numbers
    // TODO: fetch locale stats from paw bot api, hardcoded for now
    // For a package not on NPM, just return 0.
    switch(packageName) {
        case("en"): return 5_000_001;
        case("es"): return 200_001;
        default: return 0;
    }
}
