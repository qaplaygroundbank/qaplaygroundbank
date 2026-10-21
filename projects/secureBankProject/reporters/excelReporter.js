import ExcelJS from 'exceljs';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

class ExcelReporter {
    constructor(options = {}) {
        this.outputFile = path.resolve(
            options.outputFile || 'excel-report/securebank-test-results.xlsx'
        );
        this.results = new Map();
    }

    onTestEnd(test, result) {
        this.results.set(test.id, {
            title: test.title,
            suite: test.titlePath().slice(0, -1).join(' > '),
            project: test.parent.project()?.name || '',
            status: result.status,
            duration: result.duration,
            retries: result.retry,
            error: result.errors.map(({ message }) => message).filter(Boolean).join('\n')
        });
    }

    async onEnd() {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'SecureBank Playwright';
        workbook.created = new Date();

        const results = [...this.results.values()];
        const summary = workbook.addWorksheet('Summary');
        summary.columns = [
            { header: 'Metric', key: 'metric', width: 24 },
            { header: 'Count', key: 'count', width: 14 }
        ];
        summary.addRows([
            { metric: 'Total tests', count: results.length },
            { metric: 'Passed', count: results.filter(({ status }) => status === 'passed').length },
            { metric: 'Failed', count: results.filter(({ status }) => status === 'failed').length },
            { metric: 'Timed out', count: results.filter(({ status }) => status === 'timedOut').length },
            { metric: 'Skipped', count: results.filter(({ status }) => status === 'skipped').length },
            { metric: 'Interrupted', count: results.filter(({ status }) => status === 'interrupted').length }
        ]);
        this.styleHeader(summary);

        const details = workbook.addWorksheet('Test Results');
        details.columns = [
            { header: 'Test', key: 'title', width: 58 },
            { header: 'Suite', key: 'suite', width: 60 },
            { header: 'Project', key: 'project', width: 16 },
            { header: 'Status', key: 'status', width: 14 },
            { header: 'Duration (ms)', key: 'duration', width: 18 },
            { header: 'Retries', key: 'retries', width: 12 },
            { header: 'Error', key: 'error', width: 80 }
        ];
        details.addRows(results);
        details.views = [{ state: 'frozen', ySplit: 1 }];
        details.autoFilter = {
            from: 'A1',
            to: 'G1'
        };
        this.styleHeader(details);

        await mkdir(path.dirname(this.outputFile), { recursive: true });
        await workbook.xlsx.writeFile(this.outputFile);
    }

    styleHeader(sheet) {
        const header = sheet.getRow(1);
        header.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        header.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF1F4E78' }
        };
        header.commit();
    }
}

export default ExcelReporter;
