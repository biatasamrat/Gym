import React, { useState } from 'react';
import { X, FileText, Download, CheckCircle, Award, BookOpen, Layers, Database, ShieldCheck, Printer, Check, Copy } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface TuProjectReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TuProjectReportModal: React.FC<TuProjectReportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'report' | 'proposal'>('report');
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleCopyText = () => {
    const text = document.getElementById('report-document-content')?.innerText || '';
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = async () => {
    const reportElement = document.getElementById('report-document-content');
    if (!reportElement) return;

    try {
      setIsExporting(true);
      const canvas = await html2canvas(reportElement, {
        scale: 1.5,
        useCORS: true,
        logging: false
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`FitFlow_TU_BIM_Project_${activeTab === 'report' ? 'Report' : 'Proposal'}.pdf`);
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('Unable to generate PDF automatically. You can use Print to PDF (Ctrl+P / Cmd+P).');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-wide">Tribhuvan University Documentation Format</h2>
              <p className="text-xs text-slate-400">BIM 6th Semester Project Report & Proposal Reference</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('report')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'report'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Full Project Report (Docx Format)
            </button>
            <button
              onClick={() => setActiveTab('proposal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'proposal'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Project Proposal
            </button>

            <button
              onClick={handleCopyText}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition flex items-center space-x-1"
              title="Copy text to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 shadow-md disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Generating...' : 'Export PDF'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Document Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-50 font-serif text-slate-900 leading-relaxed">
          <div id="report-document-content" className="max-w-4xl mx-auto bg-white p-8 sm:p-14 shadow-md rounded-xl border border-slate-200 space-y-8">

            {activeTab === 'report' ? (
              <>
                {/* Title Page */}
                <div className="text-center space-y-4 border-b-2 border-slate-900 pb-10">
                  <div className="inline-block p-3 rounded-full bg-slate-100 mb-2">
                    <Award className="w-12 h-12 text-slate-800" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-widest text-slate-900">
                    Tribhuvan University
                  </h1>
                  <h2 className="text-lg font-semibold text-slate-700">Faculty of Management</h2>
                  <p className="text-sm font-medium text-slate-600">Department of Information Management</p>
                  <p className="text-sm italic text-slate-500">&lt;College / Campus Name, City, Nepal&gt;</p>

                  <div className="py-6">
                    <p className="text-xs uppercase tracking-widest text-slate-500 font-sans font-semibold">A Project Report On</p>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                      FitFlow: A Web-Based Gym Management System with Duration-Based Subscription Tracking and Automated Payment Renewal Reminders
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left pt-6 text-sm font-sans border-t border-slate-200">
                    <div>
                      <p className="font-bold text-slate-800">Submitted By:</p>
                      <p className="text-slate-700">Samrat Bista (Symbol No: 15780/23)</p>
                      <p className="text-slate-700">David Gautam (Symbol No: 15753/23)</p>
                      <p className="text-xs text-slate-500 mt-1">Bachelor of Information Management (BIM) – 6th Semester</p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">Submitted To:</p>
                      <p className="text-slate-700">Department of Information Management</p>
                      <p className="text-slate-700">Tribhuvan University</p>
                      <p className="text-xs text-slate-500 mt-1">August 2026</p>
                    </div>
                  </div>
                </div>

                {/* Declarations & Certificate */}
                <div className="space-y-6 text-sm font-sans border-b border-slate-200 pb-8">
                  <div>
                    <h3 className="text-base font-bold uppercase tracking-wider text-slate-900 mb-2">Student's Declaration</h3>
                    <p className="text-slate-700 leading-relaxed text-justify">
                      We, Samrat Bista and David Gautam, declare that the project report entitled <strong>"FitFlow: A Web-Based Gym Management System with Duration-Based Subscription Tracking and Automated Payment Renewal Reminders"</strong> was prepared by us under the supervision of Department of Information Management, Tribhuvan University. It is submitted in partial fulfillment of the requirements for the Bachelor of Information Management (BIM) degree. This is our original work and has not been submitted elsewhere.
                    </p>
                  </div>

                  <div className="pt-4">
                    <h3 className="text-base font-bold uppercase tracking-wider text-slate-900 mb-2">Supervisor's Certificate</h3>
                    <p className="text-slate-700 leading-relaxed text-justify">
                      This is to certify that the project report entitled "FitFlow: Gym Management System" was prepared by Samrat Bista and David Gautam under my supervision. The work is original and suitable for evaluation toward the BIM degree at Tribhuvan University.
                    </p>
                  </div>
                </div>

                {/* Abstract */}
                <div className="space-y-3 font-sans border-b border-slate-200 pb-8">
                  <h3 className="text-base font-bold uppercase tracking-wider text-slate-900">Abstract</h3>
                  <p className="text-sm text-slate-700 text-justify leading-relaxed">
                    Local fitness centers and gyms in Nepal often struggle with manual record keeping, lost physical logbooks, missed subscription renewals, and unorganized payment tracking. Standard tier-based fitness platforms often introduce excessive complexity with class scheduling, trainer allocations, or multi-tier memberships (Gold, Silver, Platinum) that local gyms do not need. FitFlow addresses these real-world operational challenges by providing a streamlined, single-tier duration-based subscription model (1 Month, 3 Months, 6 Months, 12 Months) with dual dashboards: an Admin/Owner Dashboard for operational metrics, real-time payment status oversight (Paid, Pending, Overdue), and automated SMS/Email renewal reminders; and a Member Dashboard for checking remaining subscription validity, payment history, and daily attendance usage logs.
                  </p>
                  <p className="text-xs font-semibold text-slate-600">
                    Keywords: Gym Management System, Duration-Based Subscriptions, Payment Renewal Reminders, BIM Project, Tribhuvan University, React, TypeScript, Express, Firestore/Supabase.
                  </p>
                </div>

                {/* Table of Contents */}
                <div className="font-sans space-y-2 text-sm border-b border-slate-200 pb-8">
                  <h3 className="text-base font-bold uppercase tracking-wider text-slate-900 mb-3">Table of Contents</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-slate-700">
                    <li>1.1 Background & Problem Statement</li>
                    <li>1.2 Project Objectives</li>
                    <li>1.3 Review of Related Work</li>
                    <li>1.4 Development Methodology (Agile)</li>
                    <li>2.1 Requirement Analysis (FR & NFR)</li>
                    <li>2.2 System Diagrams (UML & DFD)</li>
                    <li>2.3 Database Schema & ERD</li>
                    <li>2.4 Dual Dashboard Feature Breakdown</li>
                    <li>2.5 Test Cases & Execution Results</li>
                    <li>3.1 Conclusion & Recommendations</li>
                  </ul>
                </div>

                {/* Chapter One: Introduction */}
                <div className="space-y-6 font-sans">
                  <h2 className="text-lg font-bold uppercase border-b border-slate-300 pb-2 text-slate-900">
                    CHAPTER ONE: INTRODUCTION
                  </h2>

                  <div>
                    <h3 className="font-bold text-slate-900 text-sm mb-1">1.1 Background</h3>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
                      Fitness awareness in urban centers across Nepal has seen massive growth over recent years. However, most local gym owners continue to operate using paper ledgers or offline spreadsheets. This manual workflow creates friction: owners miss members whose subscriptions expire within a 7-day window, struggle to track pending/overdue payments, and lack automated reminder channels like eSewa or Khalti follow-up alerts.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-sm mb-1">1.2 Objectives</h3>
                    <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-700 space-y-1">
                      <li>Replace physical logbooks with a centralized, responsive web management system.</li>
                      <li>Implement a unified membership pricing structure based solely on duration (1 Month, 3 Months, 6 Months, 12 Months).</li>
                      <li>Provide an Admin Dashboard with key operational metrics: Total Active Members, Subscriptions Expiring in 7 Days, Overdue Balances, and Monthly Revenue.</li>
                      <li>Provide a Member Dashboard for checking active plan duration, payment receipts, and check-in history.</li>
                      <li>Integrate automated renewal reminder alerts via SMS, Email, and In-App notifications.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-sm mb-1">1.3 Scope and Limitations</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <div>
                        <span className="font-bold text-emerald-700 block mb-1">Included Scope:</span>
                        <ul className="list-disc pl-4 space-y-1">
                          <li>Duration-based subscription tracking.</li>
                          <li>Dual dashboard (Admin & Member views).</li>
                          <li>Automated renewal reminders & check-in log.</li>
                          <li>PDF/Excel report exports for payments.</li>
                        </ul>
                      </div>
                      <div>
                        <span className="font-bold text-rose-700 block mb-1">Excluded Scope:</span>
                        <ul className="list-disc pl-4 space-y-1">
                          <li>Class scheduling / instructor booking.</li>
                          <li>Multi-tier VIP packages (Gold, Silver, Platinum).</li>
                          <li>Attendance biometric hardware integration.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chapter Two: System Development & Diagrams */}
                <div className="space-y-6 font-sans">
                  <h2 className="text-lg font-bold uppercase border-b border-slate-300 pb-2 text-slate-900">
                    CHAPTER TWO: SYSTEM DEVELOPMENT PROCESS
                  </h2>

                  {/* Requirements Table */}
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm mb-2">2.1 Functional Requirements</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-700 border border-slate-300">
                        <thead className="bg-slate-100 font-bold text-slate-900 border-b border-slate-300">
                          <tr>
                            <th className="p-2 border-r">ID</th>
                            <th className="p-2 border-r">Module</th>
                            <th className="p-2 border-r">Requirement Description</th>
                            <th className="p-2">Priority</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          <tr>
                            <td className="p-2 border-r font-mono">FR-01</td>
                            <td className="p-2 border-r">Members</td>
                            <td className="p-2 border-r">Register member with name, phone, duration, start date, and end date.</td>
                            <td className="p-2 font-bold text-emerald-600">High</td>
                          </tr>
                          <tr>
                            <td className="p-2 border-r font-mono">FR-02</td>
                            <td className="p-2 border-r">Subscriptions</td>
                            <td className="p-2 border-r">Automatically flag memberships expiring within 7 days and overdue accounts.</td>
                            <td className="p-2 font-bold text-emerald-600">High</td>
                          </tr>
                          <tr>
                            <td className="p-2 border-r font-mono">FR-03</td>
                            <td className="p-2 border-r">Payments</td>
                            <td className="p-2 border-r">Record payment status (Paid, Pending, Overdue) and generate digital receipt.</td>
                            <td className="p-2 font-bold text-emerald-600">High</td>
                          </tr>
                          <tr>
                            <td className="p-2 border-r font-mono">FR-04</td>
                            <td className="p-2 border-r">Reminders</td>
                            <td className="p-2 border-r">Send automated renewal alerts via SMS/Email to expiring and overdue members.</td>
                            <td className="p-2 font-bold text-amber-600">Medium</td>
                          </tr>
                          <tr>
                            <td className="p-2 border-r font-mono">FR-05</td>
                            <td className="p-2 border-r">Usage History</td>
                            <td className="p-2 border-r">Log member check-in timestamp and display attendance history.</td>
                            <td className="p-2 font-bold text-amber-600">Medium</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Database Schema Tables */}
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm mb-2">2.2 Database Schema (SQLite / Firestore / Supabase)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                      <div className="bg-slate-900 text-slate-200 p-4 rounded-lg">
                        <p className="text-amber-400 font-bold mb-2">// Table: Members</p>
                        <p>id: string (PK)</p>
                        <p>memberCode: string (UNIQUE)</p>
                        <p>fullName: string</p>
                        <p>phone: string</p>
                        <p>currentDuration: '1_month' | '3_months' | '6_months' | '12_months'</p>
                        <p>subscriptionStartDate: date</p>
                        <p>subscriptionEndDate: date</p>
                        <p>paymentStatus: 'paid' | 'pending' | 'overdue'</p>
                        <p>amountDue: number</p>
                      </div>
                      <div className="bg-slate-900 text-slate-200 p-4 rounded-lg">
                        <p className="text-emerald-400 font-bold mb-2">// Table: PaymentRecords</p>
                        <p>id: string (PK)</p>
                        <p>memberId: string (FK)</p>
                        <p>amount: number</p>
                        <p>duration: string</p>
                        <p>paymentDate: date</p>
                        <p>paymentMethod: string</p>
                        <p>receiptNumber: string</p>
                      </div>
                    </div>
                  </div>

                  {/* Test Cases Table */}
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm mb-2">2.3 Testing & Verification</h3>
                    <table className="w-full text-left text-xs text-slate-700 border border-slate-300">
                      <thead className="bg-slate-100 font-bold text-slate-900 border-b border-slate-300">
                        <tr>
                          <th className="p-2 border-r">TC ID</th>
                          <th className="p-2 border-r">Test Case Description</th>
                          <th className="p-2 border-r">Expected Outcome</th>
                          <th className="p-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        <tr>
                          <td className="p-2 border-r font-mono">TC-01</td>
                          <td className="p-2 border-r">Register new member with 3-month plan</td>
                          <td className="p-2 border-r">End date auto-calculated to 90 days from start date.</td>
                          <td className="p-2 font-bold text-emerald-600">PASS</td>
                        </tr>
                        <tr>
                          <td className="p-2 border-r font-mono">TC-02</td>
                          <td className="p-2 border-r">Filter members expiring in 7 days</td>
                          <td className="p-2 border-r">Dashboard displays members with remaining days between 0 and 7.</td>
                          <td className="p-2 font-bold text-emerald-600">PASS</td>
                        </tr>
                        <tr>
                          <td className="p-2 border-r font-mono">TC-03</td>
                          <td className="p-2 border-r">Trigger automated payment renewal reminder</td>
                          <td className="p-2 border-r">Reminder status updates to 'Sent' with timestamp log.</td>
                          <td className="p-2 font-bold text-emerald-600">PASS</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Chapter Three: Conclusion */}
                <div className="space-y-4 font-sans">
                  <h2 className="text-lg font-bold uppercase border-b border-slate-300 pb-2 text-slate-900">
                    CHAPTER THREE: CONCLUSION & RECOMMENDATIONS
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-700 text-justify leading-relaxed">
                    FitFlow successfully fulfills the requirements of a modern gym management application tailored to Nepal's fitness center ecosystem. By focusing on duration-based subscription management and automated payment reminders, it eliminates paper ledger errors and boosts revenue retention.
                  </p>
                </div>
              </>
            ) : (
              /* Project Proposal Tab */
              <div className="space-y-6 font-sans">
                <div className="text-center border-b border-slate-300 pb-6">
                  <p className="text-xs font-bold uppercase text-amber-600 tracking-widest">Tribhuvan University - BIM Summer Project Proposal</p>
                  <h1 className="text-2xl font-bold text-slate-900 mt-2">Project Proposal on Gym Management System (FitFlow)</h1>
                  <p className="text-xs text-slate-500 mt-1">Submitted by: Samrat Bista (15780/23) & David Gautam (15753/23)</p>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base mb-1">1. Introduction</h3>
                    <p className="text-justify leading-relaxed">
                      Fitness centers require efficient, transparent, and seamless operational management to track members, join dates, and membership durations. Traditional manual logbooks or spreadsheets lead to human error, missed payment follow-ups, and unorganized record keeping. FitFlow provides an automated solution centered around duration-based subscriptions and dual dashboards for admins and members.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base mb-1">2. Problem Statement</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Manual record keeping leads to misplaced member data and inaccurate expiry calculations.</li>
                      <li>Lack of proactive renewal alerts leads to delayed subscription payments.</li>
                      <li>Existing systems present overwhelming complexity with unneeded class schedules or multi-tier plans.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base mb-1">3. Objectives</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Digitalize gym member registration, duration-based renewals, and payment tracking.</li>
                      <li>Provide real-time dashboard metrics: Active Members, Expiring This Week, Overdue Balances, Revenue.</li>
                      <li>Implement automated renewal reminder follow-ups via SMS and Email.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base mb-1">4. Technology Stack</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-100 p-4 rounded-lg font-mono text-xs">
                      <div><span className="font-bold block text-slate-900">Frontend:</span> React, TypeScript, Tailwind CSS</div>
                      <div><span className="font-bold block text-slate-900">Backend:</span> Express.js / Node.js</div>
                      <div><span className="font-bold block text-slate-900">Database:</span> Firestore / SQLite</div>
                      <div><span className="font-bold block text-slate-900">Build:</span> Vite, esbuild</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer info bar */}
        <div className="bg-slate-100 px-6 py-3 text-xs text-slate-600 flex items-center justify-between border-t border-slate-200 font-sans">
          <span>Format: Tribhuvan University (BIM 6th Semester Standards)</span>
          <span className="font-semibold text-slate-800">Prepared by Samrat Bista & David Gautam</span>
        </div>

      </div>
    </div>
  );
};
