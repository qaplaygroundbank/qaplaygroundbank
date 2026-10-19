
import ExcelJS from 'exceljs';
import path from 'node:path';

async function generateExcelReport(testResults, reportConfig) {
    const workbook = new ExcelJS.Workbook();

    const isUiProject = reportConfig.project === 'securebank';
    const projectLabel = isUiProject
        ? 'UI AUTOMATION TEST REPORT'
        : 'API AUTOMATION TEST REPORT';
    const reportTitle = isUiProject
        ? 'UI Test Execution Report'
        : 'API Test Execution Report';
    const fileName = isUiProject
        ? 'ui-report.xlsx'
        : 'api-report.xlsx';

    workbook.creator = 'QA Playground Bank';
    workbook.subject = reportTitle;
    workbook.title = reportTitle;
    workbook.created = new Date();

    const total = testResults.length;
    const passed = testResults.filter(
        (test) => test.status === 'Passed'
    ).length;
    const failed = testResults.filter(
        (test) => test.status === 'Failed'
    ).length;
    const skipped = testResults.filter(
        (test) => test.status === 'Skipped'
    ).length;

    // Summary worksheet
    const summarySheet = workbook.addWorksheet('Summary');

    summarySheet.addRows([
        [projectLabel],
        [],
        ['Project', reportConfig.project],
        ['Environment', reportConfig.environment],
        ['Suite', reportConfig.suite],
        ['Execution Date', new Date().toLocaleString()],
        [],
        ['Metric', 'Count'],
        ['Total Tests', total],
        ['Passed', passed],
        ['Failed', failed],
        ['Skipped', skipped]
    ]);

    summarySheet.mergeCells('A1:B1');
    summarySheet.getCell('A1').font = {
        bold: true,
        size: 16
    };

    summarySheet.getRow(8).font = { bold: true };
    summarySheet.columns = [
        { width: 28 },
        { width: 35 }
    ];

    // Detailed test results worksheet
    const resultsSheet = workbook.addWorksheet('Test Results');

    resultsSheet.columns = [
        { header: 'Test Case', key: 'testCase', width: 55 },
        { header: 'Suite', key: 'suite', width: 30 },
        { header: 'Status', key: 'status', width: 14 },
        { header: 'Duration (ms)', key: 'duration', width: 18 },
        { header: 'Environment', key: 'environment', width: 16 },
        { header: 'Error Message', key: 'error', width: 65 }
    ];

    resultsSheet.addRows(
        testResults.map((test) => ({
            testCase: test.testCase,
            suite: test.suite,
            status: test.status,
            duration: test.duration,
            environment: reportConfig.environment,
            error: test.error || ''
        }))
    );

    resultsSheet.getRow(1).font = { bold: true };
    resultsSheet.getRow(1).alignment = {
        vertical: 'middle',
        wrapText: true
    };
    resultsSheet.getRow(1).height = 24;

    resultsSheet.views = [
        { state: 'frozen', ySplit: 1 }
    ];

    resultsSheet.autoFilter = {
        from: 'A1',
        to: 'F1'
    };

    for (
        let rowNumber = 2;
        rowNumber <= resultsSheet.rowCount;
        rowNumber++
    ) {
        resultsSheet.getRow(rowNumber).alignment = {
            vertical: 'top',
            wrapText: true
        };
    }

    const outputPath = path.join(
        reportConfig.outputDirectory,
        fileName
    );

    await workbook.xlsx.writeFile(outputPath);

    return outputPath;
}

export { generateExcelReport };
