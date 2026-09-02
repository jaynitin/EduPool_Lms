import jsPDF from 'jspdf';

export function generateCertificate({ studentName, courseTitle, instructorName, completionDate }) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Colors (matching app palette)
  const primary = '#224248';
  const tertiary = '#44A1A4';
  const quaternary = '#FF9A00';

  // Border
  doc.setDrawColor(primary);
  doc.setLineWidth(4);
  doc.rect(20, 20, pageWidth - 40, pageHeight - 40);

  doc.setDrawColor(quaternary);
  doc.setLineWidth(1.5);
  doc.rect(30, 30, pageWidth - 60, pageHeight - 60);

  // Brand
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(primary);
  doc.text('Edu', pageWidth / 2 - 30, 90, { align: 'right' });
  doc.setTextColor(quaternary);
  doc.text('Pool', pageWidth / 2 - 28, 90, { align: 'left' });

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(36);
  doc.setTextColor(primary);
  doc.text('CERTIFICATE', pageWidth / 2, 150, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.text('O F   C O M P L E T I O N', pageWidth / 2, 175, { align: 'center' });

  // Body
  doc.setFontSize(13);
  doc.setTextColor(80, 80, 80);
  doc.text('This is to certify that', pageWidth / 2, 220, { align: 'center' });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(30);
  doc.setTextColor(tertiary);
  doc.text(studentName, pageWidth / 2, 260, { align: 'center' });

  doc.setDrawColor(180);
  doc.setLineWidth(0.5);
  doc.line(pageWidth / 2 - 150, 275, pageWidth / 2 + 150, 275);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.setTextColor(80, 80, 80);
  doc.text('has successfully completed the course', pageWidth / 2, 305, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(primary);
  doc.text(courseTitle, pageWidth / 2, 335, { align: 'center' });

  // Footer — date and instructor
  const footerY = pageHeight - 90;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.text(completionDate, 120, footerY);
  doc.setDrawColor(180);
  doc.line(70, footerY + 8, 170, footerY + 8);
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text('Date of Completion', 120, footerY + 22, { align: 'center' });

  if (instructorName) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(14);
    doc.setTextColor(60, 60, 60);
    doc.text(instructorName, pageWidth - 120, footerY);
    doc.setDrawColor(180);
    doc.line(pageWidth - 170, footerY + 8, pageWidth - 70, footerY + 8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text('Instructor', pageWidth - 120, footerY + 22, { align: 'center' });
  }

  doc.save(`${courseTitle.replace(/\s+/g, '_')}_Certificate.pdf`);
}