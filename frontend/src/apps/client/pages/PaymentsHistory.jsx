import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const PaymentsHistory = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || "all",
    dateRange: searchParams.get("dateRange") || ""
  });

  const statusPill = {
    Paid: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
    Refunded: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
    Failed: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
  };

  useEffect(() => {
    fetchPayments();
  }, [filters]);

  useEffect(() => {
    const receiptId = searchParams.get("receipt") || searchParams.get("paymentId");
    if (receiptId) {
      handleViewReceipt(receiptId);
    }
  }, [searchParams]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const userId = "mock-user-id";
      const params = new URLSearchParams();
      if (filters.status !== "all") params.append("status", filters.status);
      if (filters.dateRange) params.append("dateRange", filters.dateRange);

      const response = await fetch(`/api/payments/history?${params.toString()}`, {
        headers: { "x-user-id": userId }
      });
      if (response.ok) {
        const data = await response.json();
        setRows(data.map(p => ({
          id: p.payment_reference,
          service: p.service_type,
          worker: p.worker_name,
          serviceDate: p.service_date ? new Date(p.service_date).toLocaleDateString() : "N/A",
          paymentDate: p.payment_date ? new Date(p.payment_date).toLocaleDateString() : "N/A",
          amount: `$${parseFloat(p.amount).toFixed(2)}`,
          status: p.status,
          paymentData: p
        })));
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const [showReceipt, setShowReceipt] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState(null);

  const handleViewReceipt = async (paymentId) => {
    try {
      const userId = "mock-user-id";
      const response = await fetch(`/api/payments/${paymentId}/receipt`, {
        headers: { "x-user-id": userId }
      });
      if (response.ok) {
        const data = await response.json();
        setActiveReceipt(data);
        setShowReceipt(true);
      }
    } catch (error) {
      console.error("Error fetching receipt:", error);
      const row = rows.find(r => r.id === paymentId);
      if (row) {
        setActiveReceipt(row.paymentData || row);
        setShowReceipt(true);
      }
    }
  };

  const filteredRows = rows.filter(row => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!row.service.toLowerCase().includes(searchLower) &&
        !row.worker.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    if (filters.status !== "all" && row.status.toLowerCase() !== filters.status.toLowerCase()) {
      return false;
    }
    return true;
  });

  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
      <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="p-4 md:p-6 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative w-full lg:flex-grow">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg sm:text-xl">
                search
              </span>
              <input
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-primary focus:border-primary"
                placeholder="Search by worker, service..."
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 lg:flex lg:items-center gap-3 sm:gap-4">
              <select
                className="w-full text-sm border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-primary focus:border-primary"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="all">Status: All</option>
                <option value="paid">Paid</option>
                <option value="refunded">Refunded</option>
                <option value="failed">Failed</option>
                <option value="pending">Pending</option>
              </select>
              <select
                className="w-full text-sm border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-primary focus:border-primary"
                value={filters.dateRange}
                onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
              >
                <option value="">Payment Date</option>
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading payment history...</p>
          </div>
        ) : filteredRows.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500 dark:text-gray-400">No payments found.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                  <tr>
                    <th className="px-4 sm:px-6 py-3" scope="col">Service / Worker</th>
                    <th className="px-4 sm:px-6 py-3 hidden sm:table-cell" scope="col">Service Date</th>
                    <th className="px-4 sm:px-6 py-3" scope="col">Payment Date</th>
                    <th className="px-4 sm:px-6 py-3" scope="col">Amount</th>
                    <th className="px-4 sm:px-6 py-3" scope="col">Status</th>
                    <th className="px-4 sm:px-6 py-3 text-right" scope="col">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row) => (
                    <tr
                      key={row.id}
                      className="bg-white dark:bg-gray-900/50 border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="px-4 sm:px-6 py-4">
                        <div className="text-xs sm:text-sm">
                          <p className="font-medium text-gray-900 dark:text-white">{row.service}</p>
                          <p className="text-gray-500 dark:text-gray-400">{row.worker}</p>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 hidden sm:table-cell text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                        {row.serviceDate}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                        {row.paymentDate}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                        {row.amount}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusPill[row.status] || statusPill.Paid}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleViewReceipt(row.id)}
                            className="flex items-center justify-center gap-2 min-w-[84px] cursor-pointer rounded-lg h-8 sm:h-9 px-3 sm:px-4 bg-primary text-white text-xs sm:text-sm font-bold shadow-sm hover:bg-primary/90 transition-colors whitespace-nowrap"
                          >
                            View Receipt
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 md:p-6 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">Showing 1 to 4 of 16 entries</span>
              <div className="inline-flex items-center -space-x-px">
                {["Previous", "1", "2", "3", "4", "Next"].map((p, idx) => (
                  <a
                    key={idx}
                    className={`px-3 py-2 leading-tight text-sm border ${p === "1"
                      ? "text-primary bg-primary/10 border-primary hover:bg-primary/20"
                      : "text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      } ${idx === 0 ? "rounded-l-lg" : ""} ${idx === 5 ? "rounded-r-lg" : ""}`}
                    href="#"
                  >
                    {p}
                  </a>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {showReceipt && activeReceipt && (
        <ReceiptModal receipt={activeReceipt} onClose={() => { setShowReceipt(false); setActiveReceipt(null); }} />
      )}
    </main>
  );
};

const ReceiptModal = ({ receipt, onClose }) => {
  // Handle both old row format and new receipt format
  const row = receipt.id ? receipt : {
    id: receipt.payment_reference || "N/A",
    service: receipt.service_type || receipt.service || "N/A",
    worker: receipt.worker_name || receipt.worker || "N/A",
    serviceDate: receipt.booking_date ? new Date(receipt.booking_date).toLocaleDateString() : (receipt.serviceDate || "N/A"),
    paymentDate: receipt.payment_date ? new Date(receipt.payment_date).toLocaleDateString() : (receipt.paymentDate || "N/A"),
    amount: receipt.amount ? parseFloat(receipt.amount).toFixed(2) : (receipt.amount ? receipt.amount.replace('$', '') : "0.00"),
    status: receipt.status || "Paid",
    location: receipt.location_address || "Service Location Provided",
    hourlyRate: receipt.hourly_rate || 0,
    duration: receipt.duration_hours || 0
  };

  const totalAmount = parseFloat(row.amount).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-3xl max-h-[90vh] flex flex-col bg-white dark:bg-gray-900 rounded-xl shadow-lg">
        <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Receipt</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="flex-grow overflow-y-auto p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Quick Staff</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Professional Home Services</p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Receipt ID</p>
              <p className="font-mono text-gray-800 dark:text-gray-200">#{row.id}</p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Payment Date: <span className="font-medium text-gray-700 dark:text-gray-300">{row.paymentDate}</span>
              </p>
            </div>
          </div>
          <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50">
            <h4 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4">Service Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Worker</p>
                <p className="font-medium text-gray-900 dark:text-white">{row.worker}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Service Type</p>
                <p className="font-medium text-gray-900 dark:text-white">{row.service}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Service Date</p>
                <p className="font-medium text-gray-900 dark:text-white">{row.serviceDate}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Service Location</p>
                <p className="font-medium text-gray-900 dark:text-white">{row.location}</p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4">Cost Breakdown</h4>
            <div className="space-y-3 text-sm border-b border-gray-200 dark:border-gray-700 pb-4">
              <div className="flex justify-between items-center">
                <p className="text-gray-600 dark:text-gray-300">Service Charge</p>
                <p className="font-medium text-gray-800 dark:text-gray-200">${totalAmount}</p>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4 pt-2">
              <p className="text-lg font-bold text-gray-900 dark:text-white">Total Paid</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">${totalAmount}</p>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-300">Payment Method</p>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-xl text-gray-700 dark:text-gray-200">payments</span>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Cash / Online Payment</p>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 flex flex-col sm:flex-row items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors whitespace-nowrap"
          >
            <span className="material-symbols-outlined !text-xl">print</span>
            <span>Print Receipt</span>
          </button>
          <button
            onClick={() => alert("Downloading PDF receipt...")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-lg shadow-sm hover:bg-primary/90 transition-colors whitespace-nowrap"
          >
            <span className="material-symbols-outlined !text-xl">download</span>
            <span>Download PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const workerImage = (worker) => {
  if (worker.includes("David")) return "https://lh3.googleusercontent.com/aida-public/AB6AXuAVY_efxvaaRXhPrj4GTPLZItFbk1Z0r5Z2XXCEOp4emJBv5NlO86UMrPFyihE4ElMjQx42WfPv1V_On0snm1FmQ8yWc3ow2_VZ7x-3G7YM-512SKLuJXFGlXuDLI0qxTYoGEoyxVBuDC9V5gqQIc39P7G4QBybr38oH3l50rOVS-Kwn0SObPmnRWbEN7Bm2ivQt6hE-Oy8pVriSXr6ckZ8837m6lQFcMgGX9AVOVdkwJpfbJj4WnsUls6YgRCdKmXjWXTPZ8MMjTY";
  if (worker.includes("Sarah")) return "https://lh3.googleusercontent.com/aida-public/AB6AXuBosDnHfTRXGXvFoyiqjIbXk5zhwiLazIQX-8fQUZyrDM-liJGUSKoMaumIXykzg7eKyTvUYWLrSoyDRR1tyG7QFGD91LUTlIsp0TWxFt7uVUeC7k92kh7t0_CASsaOvmDxCxbJX3LWy-JNOjC6mq-ayi3_uTeHSiODsw4-r_JSEb_OkeFBk1Gz8myZqCYDk63C6Ggoc0TFmoH2lf9ussYGhaazUSa-8tGd30DK9gruI1nfAXplClU2npaIY3BqAsHfGhGdx5FL0yU";
  if (worker.includes("Maria")) return "https://lh3.googleusercontent.com/aida-public/AB6AXuBPWHo0Bcovk7tb2-amBLqTRP4OEjtqKG2qyIhS-mGN_O8A5ZcJVwBpk0INdM7SCVDJQB1c3gwv8duSiwPE5afy6k-_-KoY89jtbtA1ircNx0MAZq5FHo2KrZxgnEmJXjwLKwxmciZZd-sIo5ax8R-yEmWQSmIbGrpsUFTu8-npH8sum3oGYglilQJk97BjLSvxLmcBlnIZmxHqLR1rvOjzisanch8VVkkHnz5doCCcV5FCLMMOalHFhYOh1KHVhqqz80Args1X-og";
  return "https://lh3.googleusercontent.com/aida-public/AB6AXuA_kxqiPcCxNMeYU-I6joYsMcC05IXeFaA_GAnsSR0w9Kg3-Dj-EKhZ66hTh7BMjEcbwv2TaVhJafJ8Ykbw1pajOam9T9M8uF7CDrjnGAchzQlxavUn0JBtJeeSCnxgfvPSPo7PUi916pcmaV3RayG2Fh-5mlZPboep_IU_7byPU25eCSuPmQM-ncIvhyLHR9m_wYWQvqvXZKdLvr7SldszQxyF6x_21LJW1DWpVOfyibifneoJEg4oq1PQCAapwwQ6lUK1iMJiyTw";
};

export default PaymentsHistory;