class CategorySummaryReporter {
    onEnd() {
        const categories = ['positive', 'negative', 'boundary'];
        const lines = ['\nCRM test case categories:'];

        for (const category of categories) {
            const tests = this.allTests.filter((test) =>
                new RegExp(`@${category}\\b`, 'i').test(test.title)
            );

            lines.push(`\n${category.toUpperCase()} (${tests.length}):`);
            for (const test of tests) {
                lines.push(`  - ${test.title.replace(/@\w+\s*-?\s*/g, '').trim()}`);
            }
        }

        process.stdout.write(`${lines.join('\n')}\n`);
    }

    onBegin(_config, suite) {
        this.allTests = suite.allTests();
    }
}

export default CategorySummaryReporter;
