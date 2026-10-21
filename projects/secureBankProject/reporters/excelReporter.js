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
            project: test.parent.project()?.name || '',
            status: result.status,
            error: result.errors.map(({ message }) => message).filter(Boolean).join('\n')
        });
    }

    async onEnd() {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'SecureBank Playwright';
        workbook.created = new Date();

        const results = [...this.results.values()];
        const passed = results.filter(({ status }) => status === 'passed').length;
        const failed = results.filter(({ status }) =>
            ['failed', 'timedOut', 'interrupted'].includes(status)
        ).length;
        const browserNames = [...new Set(results.map(({ project }) => project).filter(Boolean))];
        const browser = browserNames.length > 0 ? browserNames.join(', ') : 'N/A';
        const report = workbook.addWorksheet('Execution Report');

        report.columns = [
            { width: 9 },
            { width: 50 },
            { width: 36 },
            { width: 31 },
            { width: 14 }
        ];
        report.mergeCells('A1:E1');
        report.getCell('A1').value = 'SECUREBANK | TEST EXECUTION REPORT';
        report.getRow(1).height = 30;
        report.getCell('A1').font = {
            bold: true,
            size: 16,
            color: { argb: 'FFFFFFFF' }
        };
        report.getCell('A1').fill = this.fill('FF17365D');
        report.getCell('A1').alignment = { vertical: 'middle' };

        const metadata = [
            ['Application', 'SecureBank'],
            ['Framework', 'Playwright JavaScript'],
            ['Browser', browser],
            ['Execution date', new Date()]
        ];
        metadata.forEach(([label, value], index) => {
            const row = index + 3;
            report.getCell(`A${row}`).value = label;
            report.getCell(`B${row}`).value = value;
            report.getCell(`A${row}`).font = { bold: true };
            report.getCell(`A${row}`).alignment = { vertical: 'middle' };
            report.getCell(`B${row}`).alignment = { vertical: 'middle' };
        });
        report.getCell('B6').numFmt = 'dd-mmm-yy';

        [
            ['Executed', results.length],
            ['Passed', passed],
            ['Failed', failed],
            ['Pass rate', results.length ? passed / results.length : 0]
        ].forEach(([label, value], index) => {
            const row = index + 3;
            report.getCell(`D${row}`).value = label;
            report.getCell(`E${row}`).value = value;
            report.getCell(`D${row}`).font = { bold: true };
        });
        report.getCell('E6').numFmt = '0%';

        const headerRow = 8;
        const headers = ['S.No.', 'Test Case', 'Expected Result', 'Actual Result', 'Status'];
        headers.forEach((header, index) => {
            const cell = report.getCell(headerRow, index + 1);
            cell.value = header;
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = this.fill('FF1F4E78');
            cell.alignment = { vertical: 'middle', wrapText: true };
        });
        report.getRow(headerRow).height = 24;

        results.forEach((result, index) => {
            const rowNumber = headerRow + index + 1;
            const isPassed = result.status === 'passed';
            const status = isPassed
                ? 'PASS'
                : result.status === 'skipped'
                    ? 'SKIPPED'
                    : result.status.toUpperCase();
            const row = report.getRow(rowNumber);

            row.values = [
                index + 1,
                result.title,
                'Expected behavior for this test case is satisfied.',
                isPassed
                    ? 'All test assertions passed.'
                    : result.error || `Test ended with status: ${result.status}.`,
                status
            ];
            row.height = 42;
            row.alignment = { vertical: 'middle', wrapText: true };
            row.getCell(1).alignment = {
                vertical: 'middle',
                horizontal: 'right'
            };
            row.getCell(5).alignment = {
                vertical: 'middle',
                horizontal: 'center'
            };
            row.getCell(5).font = {
                bold: true,
                color: { argb: isPassed ? 'FF188038' : 'FFB42318' }
            };
            row.getCell(5).fill = this.fill(isPassed ? 'FFD9EAD3' : 'FFFCE4D6');
        });

        const evidenceRow = headerRow + results.length + 2;
        report.getCell(`A${evidenceRow}`).value = 'Evidence';
        report.getCell(`A${evidenceRow}`).font = { bold: true };
        report.mergeCells(`B${evidenceRow}:E${evidenceRow}`);
        report.getCell(`B${evidenceRow}`).value =
            'Playwright HTML Report and Allure Report';
        report.getCell(`B${evidenceRow}`).alignment = { wrapText: true };

        report.views = [{ state: 'frozen', ySplit: headerRow }];
        report.autoFilter = {
            from: `A${headerRow}`,
            to: `E${headerRow + results.length}`
        };
        report.pageSetup = {
            orientation: 'landscape',
            fitToPage: true,
            fitToWidth: 1,
            fitToHeight: 0
        };
        report.printArea = `A1:E${evidenceRow}`;

        await mkdir(path.dirname(this.outputFile), { recursive: true });
        await workbook.xlsx.writeFile(this.outputFile);
    }

    fill(color) {
        return {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: color }
        };
    }
}

export default ExcelReporter;
