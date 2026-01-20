import { useEffect, useState } from "react";
import { getPendingRequests, reviewRequest } from "../api/manager.api";
import { toast } from "sonner";
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon, 
  InformationCircleIcon 
} from "@heroicons/react/24/outline";

export default function ApprovalsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await getPendingRequests();
      setRequests(data);
    } catch (error) {
      toast.error("Error fetching approval requests");
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await reviewRequest(id, status, "Processed by Manager");
      toast.success(`Request ${status.toLowerCase()} successfully`);
      fetchRequests(); // Refresh list
    } catch (error) {
      toast.error("Failed to process request");
    }
  };

  if (loading) return <div className="p-10 text-white">Loading requests...</div>;

  return (
    <div className="p-6 bg-[#0a0c10] min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Pending Approvals</h1>
          <p className="text-gray-400">Review and manage action requests from sub-managers.</p>
        </header>

        {requests.length === 0 ? (
          <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-12 text-center">
            <ClockIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">No pending requests at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {requests.map((req) => (
              <div key={req._id} className="bg-[#161b22] border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Requester Info */}
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-600/10 p-3 rounded-lg">
                      <InformationCircleIcon className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-blue-900/30 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                          {req.targetType} {req.actionType}
                        </span>
                        <span className="text-gray-500 text-xs">{new Date(req.createdAt).toLocaleString()}</span>
                      </div>
                      <h3 className="text-white font-semibold">Requested by: {req.requestedBy?.name}</h3>
                      <p className="text-gray-400 text-sm">{req.requestedBy?.email}</p>
                    </div>
                  </div>

                  {/* Payload Details */}
                  <div className="bg-[#0d1117] p-3 rounded-lg border border-gray-800 flex-1 max-w-md">
                    <p className="text-[11px] font-bold text-gray-500 uppercase mb-2">Proposed Changes</p>
                    <pre className="text-xs text-green-400 font-mono overflow-x-auto">
                      {JSON.stringify(req.payload, null, 2)}
                    </pre>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleReview(req._id, "REJECTED")}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white transition-all text-sm font-bold"
                    >
                      <XCircleIcon className="w-5 h-5" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleReview(req._id, "APPROVED")}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-500 transition-all text-sm font-bold shadow-lg shadow-green-900/20"
                    >
                      <CheckCircleIcon className="w-5 h-5" />
                      Approve
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}