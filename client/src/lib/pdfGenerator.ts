import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { QuarterlyData, QuarterlyReportsData } from "@/hooks/useQuarterlyReports";

export interface PDFOptions {
  filename?: string;
  format?: "a4" | "letter";
  orientation?: "portrait" | "landscape";
}

export async function generateQuarterlyPDF(
  quarter: QuarterlyData,
  fullData: QuarterlyReportsData,
  options: PDFOptions = {}
) {
  const {
    filename = `Environmental-Report-${quarter.quarter}-2024.pdf`,
    format = "a4",
    orientation = "portrait",
  } = options;

  // Create a temporary element with the report content
  const reportElement = document.createElement("div");
  reportElement.style.width = "210mm";
  reportElement.style.padding = "20px";
  reportElement.style.fontFamily = "Inter, sans-serif";
  reportElement.style.backgroundColor = "white";
  reportElement.style.color = "black";

  reportElement.innerHTML = `
    <div style="margin-bottom: 30px;">
      <h1 style="color: #3b82f6; font-size: 28px; margin-bottom: 10px; font-weight: 700;">
        Environmental Care Management
      </h1>
      <h2 style="color: #374151; font-size: 22px; margin-bottom: 20px; font-weight: 600;">
        ${quarter.quarter} 2024 Quarterly Report
      </h2>
      <div style="height: 2px; background: linear-gradient(to right, #3b82f6, #10b981); margin-bottom: 20px;"></div>
    </div>

    <div style="margin-bottom: 30px;">
      <h3 style="font-size: 18px; margin-bottom: 15px; color: #374151; font-weight: 600;">Quarter Summary</h3>
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <p style="margin: 8px 0; font-size: 14px;"><strong>Period:</strong> ${quarter.period}</p>
            <p style="margin: 8px 0; font-size: 14px;"><strong>Total Reports:</strong> ${quarter.totalReports}</p>
          </div>
          <div>
            <p style="margin: 8px 0; font-size: 14px;"><strong>Resolved:</strong> ${quarter.resolved}</p>
            <p style="margin: 8px 0; font-size: 14px;"><strong>Pending:</strong> ${quarter.pending}</p>
          </div>
        </div>
        <p style="margin: 15px 0 8px 0; font-size: 16px; color: #059669;"><strong>Resolution Rate: ${quarter.resolutionRate}%</strong></p>
      </div>
    </div>

    <div style="margin-bottom: 30px;">
      <h3 style="font-size: 18px; margin-bottom: 15px; color: #374151; font-weight: 600;">Environmental Impact Categories</h3>
      <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div style="padding: 10px; border-left: 3px solid #3b82f6;">
            <strong>Water Issues:</strong> ${Math.round(quarter.totalReports * 0.35)} reports (35%)
          </div>
          <div style="padding: 10px; border-left: 3px solid #10b981;">
            <strong>Air Quality:</strong> ${Math.round(quarter.totalReports * 0.25)} reports (25%)
          </div>
          <div style="padding: 10px; border-left: 3px solid #f59e0b;">
            <strong>Waste Management:</strong> ${Math.round(quarter.totalReports * 0.20)} reports (20%)
          </div>
          <div style="padding: 10px; border-left: 3px solid #ef4444;">
            <strong>Noise Pollution:</strong> ${Math.round(quarter.totalReports * 0.15)} reports (15%)
          </div>
        </div>
        <div style="padding: 10px; border-left: 3px solid #8b5cf6; margin-top: 15px;">
          <strong>Others:</strong> ${Math.round(quarter.totalReports * 0.05)} reports (5%)
        </div>
      </div>
    </div>

    <div style="margin-bottom: 30px;">
      <h3 style="font-size: 18px; margin-bottom: 15px; color: #374151; font-weight: 600;">Key Performance Indicators</h3>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
        <div style="text-align: center; padding: 15px; background: #fef3c7; border-radius: 8px;">
          <div style="font-size: 24px; font-weight: 700; color: #d97706;">${Math.round(fullData.taskSummary.total * 0.29)}</div>
          <div style="color: #92400e; font-size: 14px;">Pending Tasks</div>
        </div>
        <div style="text-align: center; padding: 15px; background: #dbeafe; border-radius: 8px;">
          <div style="font-size: 24px; font-weight: 700; color: #2563eb;">${Math.round(fullData.taskSummary.total * 0.22)}</div>
          <div style="color: #1d4ed8; font-size: 14px;">In Progress</div>
        </div>
        <div style="text-align: center; padding: 15px; background: #dcfce7; border-radius: 8px;">
          <div style="font-size: 24px; font-weight: 700; color: #16a34a;">${Math.round(fullData.taskSummary.total * 0.49)}</div>
          <div style="color: #15803d; font-size: 14px;">Completed</div>
        </div>
      </div>
    </div>

    <div style="margin-bottom: 30px;">
      <h3 style="font-size: 18px; margin-bottom: 15px; color: #374151; font-weight: 600;">Community Engagement</h3>
      <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; text-align: center;">
          <div>
            <div style="font-size: 28px; font-weight: 700; color: #3b82f6;">${Math.round(fullData.engagementSummary.totalComments / 4)}</div>
            <div style="color: #6b7280; font-size: 14px;">Comments This Quarter</div>
          </div>
          <div>
            <div style="font-size: 28px; font-weight: 700; color: #10b981;">${Math.round(fullData.engagementSummary.responsesGiven / 4)}</div>
            <div style="color: #6b7280; font-size: 14px;">Responses Given</div>
          </div>
          <div>
            <div style="font-size: 28px; font-weight: 700; color: #f59e0b;">${fullData.engagementSummary.avgResponseTime}</div>
            <div style="color: #6b7280; font-size: 14px;">Avg. Response Time (days)</div>
          </div>
        </div>
      </div>
    </div>

    <div style="page-break-before: always; margin-bottom: 30px;">
      <h3 style="font-size: 18px; margin-bottom: 15px; color: #374151; font-weight: 600;">Key Achievements</h3>
      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px;">
        ${fullData.achievements.slice(0, 3).map(achievement => `
          <div style="margin-bottom: 10px; padding-left: 20px; position: relative;">
            <span style="position: absolute; left: 0; color: #10b981; font-weight: bold;">✓</span>
            ${achievement}
          </div>
        `).join('')}
      </div>
    </div>

    <div style="margin-bottom: 30px;">
      <h3 style="font-size: 18px; margin-bottom: 15px; color: #374151; font-weight: 600;">Recommendations</h3>
      <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px;">
        ${fullData.recommendations.slice(0, 3).map(recommendation => `
          <div style="margin-bottom: 10px; padding-left: 20px; position: relative;">
            <span style="position: absolute; left: 0; color: #3b82f6; font-weight: bold;">→</span>
            ${recommendation}
          </div>
        `).join('')}
      </div>
    </div>

    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <div style="display: flex; justify-content: space-between; font-size: 12px; color: #6b7280;">
        <div>Generated on: ${new Date().toLocaleDateString()}</div>
        <div>Environmental Care Management Platform</div>
      </div>
    </div>
  `;

  // Temporarily add to DOM
  document.body.appendChild(reportElement);

  try {
    const canvas = await html2canvas(reportElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const pdf = new jsPDF({
      orientation,
      unit: "mm",
      format,
    });

    const imgData = canvas.toDataURL("image/png");
    const imgWidth = format === "a4" ? 210 : 216;
    const pageHeight = format === "a4" ? 297 : 279;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  } finally {
    // Clean up
    document.body.removeChild(reportElement);
  }
}

export async function generateAllQuartersPDF(
  quartersData: QuarterlyData[],
  fullData: QuarterlyReportsData,
  options: PDFOptions = {}
) {
  const {
    filename = `Environmental-Annual-Report-2024.pdf`,
    format = "a4",
    orientation = "portrait",
  } = options;

  // Create a comprehensive annual report
  const reportElement = document.createElement("div");
  reportElement.style.width = "210mm";
  reportElement.style.padding = "20px";
  reportElement.style.fontFamily = "Inter, sans-serif";
  reportElement.style.backgroundColor = "white";
  reportElement.style.color = "black";

  reportElement.innerHTML = `
    <div style="margin-bottom: 40px; text-align: center;">
      <h1 style="color: #3b82f6; font-size: 32px; margin-bottom: 10px; font-weight: 700;">
        Environmental Care Management
      </h1>
      <h2 style="color: #374151; font-size: 24px; margin-bottom: 20px; font-weight: 600;">
        2024 Annual Report
      </h2>
      <div style="height: 3px; background: linear-gradient(to right, #3b82f6, #10b981, #f59e0b, #ef4444); margin: 30px auto; width: 200px;"></div>
    </div>

    <div style="margin-bottom: 40px;">
      <h3 style="font-size: 20px; margin-bottom: 20px; color: #374151; font-weight: 600;">Annual Summary</h3>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px;">
        <div style="text-align: center; padding: 20px; background: #dbeafe; border-radius: 12px;">
          <div style="font-size: 36px; font-weight: 700; color: #2563eb;">${fullData.annualSummary.totalReports}</div>
          <div style="color: #1d4ed8; font-size: 16px; font-weight: 500;">Total Reports</div>
        </div>
        <div style="text-align: center; padding: 20px; background: #dcfce7; border-radius: 12px;">
          <div style="font-size: 36px; font-weight: 700; color: #16a34a;">${fullData.annualSummary.totalResolved}</div>
          <div style="color: #15803d; font-size: 16px; font-weight: 500;">Total Resolved</div>
        </div>
        <div style="text-align: center; padding: 20px; background: #fed7aa; border-radius: 12px;">
          <div style="font-size: 36px; font-weight: 700; color: #ea580c;">${fullData.annualSummary.resolutionRate}%</div>
          <div style="color: #c2410c; font-size: 16px; font-weight: 500;">Resolution Rate</div>
        </div>
      </div>
    </div>

    ${quartersData.map(quarter => `
      <div style="margin-bottom: 40px; page-break-inside: avoid;">
        <h3 style="font-size: 18px; margin-bottom: 15px; color: #374151; font-weight: 600;">${quarter.quarter} 2024 - ${quarter.period}</h3>
        <div style="background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
            <div style="text-align: center;">
              <div style="font-size: 20px; font-weight: 700; color: #3b82f6;">${quarter.totalReports}</div>
              <div style="font-size: 12px; color: #6b7280;">Total Reports</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 20px; font-weight: 700; color: #10b981;">${quarter.resolved}</div>
              <div style="font-size: 12px; color: #6b7280;">Resolved</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 20px; font-weight: 700; color: #f59e0b;">${quarter.pending}</div>
              <div style="font-size: 12px; color: #6b7280;">Pending</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 20px; font-weight: 700; color: #8b5cf6;">${quarter.resolutionRate}%</div>
              <div style="font-size: 12px; color: #6b7280;">Resolution Rate</div>
            </div>
          </div>
        </div>
      </div>
    `).join('')}

    <div style="page-break-before: always; margin-bottom: 30px;">
      <h3 style="font-size: 20px; margin-bottom: 20px; color: #374151; font-weight: 600;">Environmental Impact Analysis</h3>
      <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
          <div style="padding: 15px; border-left: 4px solid #3b82f6; background: #f0f9ff;">
            <div style="font-weight: 600; color: #1e40af;">Water Issues</div>
            <div style="font-size: 24px; font-weight: 700; color: #3b82f6;">${fullData.categoryData.water}</div>
            <div style="font-size: 14px; color: #6b7280;">35% of total reports</div>
          </div>
          <div style="padding: 15px; border-left: 4px solid #10b981; background: #f0fdf4;">
            <div style="font-weight: 600; color: #166534;">Air Quality</div>
            <div style="font-size: 24px; font-weight: 700; color: #10b981;">${fullData.categoryData.air}</div>
            <div style="font-size: 14px; color: #6b7280;">25% of total reports</div>
          </div>
          <div style="padding: 15px; border-left: 4px solid #f59e0b; background: #fffbeb;">
            <div style="font-weight: 600; color: #a16207;">Waste Management</div>
            <div style="font-size: 24px; font-weight: 700; color: #f59e0b;">${fullData.categoryData.waste}</div>
            <div style="font-size: 14px; color: #6b7280;">20% of total reports</div>
          </div>
          <div style="padding: 15px; border-left: 4px solid #ef4444; background: #fef2f2;">
            <div style="font-weight: 600; color: #991b1b;">Noise Pollution</div>
            <div style="font-size: 24px; font-weight: 700; color: #ef4444;">${fullData.categoryData.noise}</div>
            <div style="font-size: 14px; color: #6b7280;">15% of total reports</div>
          </div>
        </div>
      </div>
    </div>

    <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
      <div style="display: flex; justify-content: space-between; font-size: 12px; color: #6b7280;">
        <div>Generated on: ${new Date().toLocaleDateString()}</div>
        <div>Environmental Care Management Platform - Annual Report 2024</div>
      </div>
    </div>
  `;

  // Temporarily add to DOM
  document.body.appendChild(reportElement);

  try {
    const canvas = await html2canvas(reportElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const pdf = new jsPDF({
      orientation,
      unit: "mm",
      format,
    });

    const imgData = canvas.toDataURL("image/png");
    const imgWidth = format === "a4" ? 210 : 216;
    const pageHeight = format === "a4" ? 297 : 279;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  } finally {
    // Clean up
    document.body.removeChild(reportElement);
  }
}
