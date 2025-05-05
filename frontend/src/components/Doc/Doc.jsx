import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 

export const downloadAllResultsPDF = (inspecResults, terraTestResults, deploymentLogs) => {
  const doc = new jsPDF();

  doc.text('InSpec Test Results', 14, 10);
  autoTable(doc, {
    startY: 15,
    head: [['Test Name', 'Status']],
    body: inspecResults.map(row => [row.name, row.status]),
  });

  doc.text('TerraTest Results', 14, doc.lastAutoTable.finalY + 10);
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 15,
    head: [['Test Name', 'Status']],
    body: terraTestResults.map(row => [row.name, row.status]),
  });

  doc.text('Deployment Logs', 14, doc.lastAutoTable.finalY + 10);
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 15,
    head: [['Time', 'Action', 'Status', 'Message']],
    body: deploymentLogs.map(row => [row.timestamp, row.action, row.status, row.message]),
  });

  doc.save('Cloud-Infrastructure-Report.pdf');
};
