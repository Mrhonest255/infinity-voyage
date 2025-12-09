import jsPDF from 'jspdf';

interface BookingDetails {
  trackingCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  tourName: string;
  travelDate: string;
  numberOfGuests: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt?: string;
  totalPrice?: number;
}

export const generateBookingPDF = (booking: BookingDetails, isConfirmationVoucher = false): jsPDF => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Colors
  const goldColor: [number, number, number] = [212, 175, 55];
  const darkColor: [number, number, number] = [26, 26, 26];
  const grayColor: [number, number, number] = [100, 100, 100];
  const greenColor: [number, number, number] = [34, 197, 94];
  const yellowColor: [number, number, number] = [234, 179, 8];
  const blueColor: [number, number, number] = [59, 130, 246];
  const redColor: [number, number, number] = [239, 68, 68];

  // Header background
  doc.setFillColor(...darkColor);
  doc.rect(0, 0, pageWidth, 55, 'F');

  // Gold accent line
  doc.setFillColor(...goldColor);
  doc.rect(0, 55, pageWidth, 3, 'F');

  // Company Logo/Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(...goldColor);
  doc.text('INFINITY VOYAGE', pageWidth / 2, 25, { align: 'center' });

  // Tagline
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('Tanzania Safari & Zanzibar Adventures', pageWidth / 2, 35, { align: 'center' });

  // Voucher Type Title
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  const voucherTitle = isConfirmationVoucher ? 'BOOKING CONFIRMATION VOUCHER' : 'BOOKING REQUEST VOUCHER';
  doc.text(voucherTitle, pageWidth / 2, 48, { align: 'center' });

  // Status Badge
  let statusColor: [number, number, number];
  let statusText: string;
  
  switch (booking.status) {
    case 'confirmed':
      statusColor = greenColor;
      statusText = 'CONFIRMED';
      break;
    case 'completed':
      statusColor = blueColor;
      statusText = 'COMPLETED';
      break;
    case 'cancelled':
      statusColor = redColor;
      statusText = 'CANCELLED';
      break;
    default:
      statusColor = yellowColor;
      statusText = 'PENDING';
  }

  // Status badge background
  const badgeWidth = 60;
  const badgeHeight = 10;
  const badgeX = (pageWidth - badgeWidth) / 2;
  const badgeY = 65;
  
  doc.setFillColor(...statusColor);
  doc.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 2, 2, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(statusText, pageWidth / 2, badgeY + 7, { align: 'center' });

  // Tracking Code Section
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(20, 82, pageWidth - 40, 25, 3, 3, 'F');
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...grayColor);
  doc.text('TRACKING CODE', pageWidth / 2, 91, { align: 'center' });
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...darkColor);
  doc.text(booking.trackingCode, pageWidth / 2, 102, { align: 'center' });

  // Booking Details Section
  let yPos = 120;
  const leftMargin = 25;
  const rightCol = 110;
  
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);
  doc.line(leftMargin, yPos - 5, pageWidth - leftMargin, yPos - 5);

  // Section Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...goldColor);
  doc.text('BOOKING DETAILS', leftMargin, yPos);
  yPos += 12;

  // Customer Name
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...grayColor);
  doc.text('Guest Name:', leftMargin, yPos);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkColor);
  doc.text(booking.customerName, rightCol, yPos);
  yPos += 10;

  // Email
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);
  doc.text('Email:', leftMargin, yPos);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkColor);
  doc.text(booking.customerEmail, rightCol, yPos);
  yPos += 10;

  // Phone
  if (booking.customerPhone) {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayColor);
    doc.text('Phone:', leftMargin, yPos);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkColor);
    doc.text(booking.customerPhone, rightCol, yPos);
    yPos += 10;
  }

  // Tour Name
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);
  doc.text('Tour/Safari:', leftMargin, yPos);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkColor);
  const tourLines = doc.splitTextToSize(booking.tourName, 80);
  doc.text(tourLines, rightCol, yPos);
  yPos += tourLines.length * 6 + 4;

  // Travel Date
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);
  doc.text('Travel Date:', leftMargin, yPos);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkColor);
  doc.text(booking.travelDate, rightCol, yPos);
  yPos += 10;

  // Number of Guests
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);
  doc.text('Number of Guests:', leftMargin, yPos);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkColor);
  doc.text(String(booking.numberOfGuests), rightCol, yPos);
  yPos += 10;

  // Total Price (if available)
  if (booking.totalPrice) {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayColor);
    doc.text('Total Price:', leftMargin, yPos);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...greenColor);
    doc.text(`$${booking.totalPrice.toLocaleString()}`, rightCol, yPos);
    yPos += 10;
  }

  // Special Requests
  if (booking.specialRequests) {
    yPos += 5;
    doc.line(leftMargin, yPos - 3, pageWidth - leftMargin, yPos - 3);
    yPos += 5;
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...goldColor);
    doc.text('SPECIAL REQUESTS', leftMargin, yPos);
    yPos += 8;
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkColor);
    const requestLines = doc.splitTextToSize(booking.specialRequests, pageWidth - 50);
    doc.text(requestLines, leftMargin, yPos);
    yPos += requestLines.length * 5 + 5;
  }

  // What's Next Section (for pending bookings)
  if (booking.status === 'pending') {
    yPos += 10;
    doc.setFillColor(255, 251, 235);
    doc.roundedRect(20, yPos - 5, pageWidth - 40, 35, 3, 3, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...yellowColor);
    doc.text('WHAT\'S NEXT?', leftMargin, yPos + 5);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...grayColor);
    doc.text('1. Our team will review your booking request within 24 hours.', leftMargin, yPos + 15);
    doc.text('2. You will receive a confirmation email once approved.', leftMargin, yPos + 22);
    doc.text('3. Use your tracking code to check status anytime.', leftMargin, yPos + 29);
    yPos += 45;
  }

  // Important Info Section (for confirmed bookings)
  if (booking.status === 'confirmed') {
    yPos += 10;
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(20, yPos - 5, pageWidth - 40, 30, 3, 3, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...greenColor);
    doc.text('YOUR BOOKING IS CONFIRMED!', leftMargin, yPos + 5);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...grayColor);
    doc.text('Please keep this voucher with you during your trip.', leftMargin, yPos + 15);
    doc.text('Present this voucher to your guide upon arrival.', leftMargin, yPos + 22);
    yPos += 40;
  }

  // Footer
  const footerY = 270;
  doc.setFillColor(...darkColor);
  doc.rect(0, footerY - 5, pageWidth, 35, 'F');
  
  doc.setFillColor(...goldColor);
  doc.rect(0, footerY - 5, pageWidth, 2, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...goldColor);
  doc.text('INFINITY VOYAGE TOURS', pageWidth / 2, footerY + 7, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(200, 200, 200);
  doc.text('Kisauni, Zanzibar, Tanzania', pageWidth / 2, footerY + 14, { align: 'center' });
  doc.text('+255 758 241 294  |  info@infinityvoyagetours.com', pageWidth / 2, footerY + 20, { align: 'center' });
  doc.text('www.infinityvoyagetours.com', pageWidth / 2, footerY + 26, { align: 'center' });

  return doc;
};

export const downloadBookingPDF = (booking: BookingDetails, isConfirmationVoucher = false): void => {
  const doc = generateBookingPDF(booking, isConfirmationVoucher);
  const fileName = isConfirmationVoucher 
    ? `Infinity-Voyage-Confirmation-${booking.trackingCode}.pdf`
    : `Infinity-Voyage-Booking-${booking.trackingCode}.pdf`;
  doc.save(fileName);
};
