import { Badge, Button } from "@components";
import { Progress } from "@components/ui/progress";
import { AlertCircle, ArrowRight, Building2, Calendar, CheckCircle, ChevronRight, Clock, FileText, Info, Mail, MapPin, Phone, User, X, XCircle } from "lucide-react";
import { useState, useRef } from "react";
import { getCourseById } from "./data";

interface PlacementRequestProps {
  selectedCourseId: string;
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case "in-progress":
      return {
        color: "bg-blue-500",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-700",
        icon: Clock,
        label: "In Progress"
      };
    case "placement-started":
      return {
        color: "bg-green-500",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        textColor: "text-green-700",
        icon: CheckCircle,
        label: "Placement Started"
      };
    case "cancelled":
      return {
        color: "bg-red-500",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        textColor: "text-red-700",
        icon: X,
        label: "Cancelled"
      };
    case "completed":
      return {
        color: "bg-emerald-500",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        textColor: "text-emerald-700",
        icon: CheckCircle,
        label: "Completed"
      };
    case "rejected-by-student":
      return {
        color: "bg-orange-500",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        textColor: "text-orange-700",
        icon: X,
        label: "Rejected by Student"
      };
    case "rejected-by-industry":
      return {
        color: "bg-purple-500",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        textColor: "text-purple-700",
        icon: X,
        label: "Rejected by Industry"
      };
    case "pending":
      return {
        color: "bg-yellow-500",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        textColor: "text-yellow-700",
        icon: AlertCircle,
        label: "Pending"
      };
    case "approved":
      return {
        color: "bg-emerald-500",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        textColor: "text-emerald-700",
        icon: CheckCircle,
        label: "Approved"
      };
    default:
      return {
        color: "bg-slate-500",
        bgColor: "bg-slate-50",
        borderColor: "border-slate-200",
        textColor: "text-slate-700",
        icon: Clock,
        label: "Unknown"
      };
  }
};

export function PlacementRequest({ selectedCourseId }: PlacementRequestProps) {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [showCanceledCompleted, setShowCanceledCompleted] = useState(true);
  const [hoveredCommentId, setHoveredCommentId] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);
  const course = getCourseById(selectedCourseId);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>, requestId: string) => {
    setHoveredCommentId(requestId);
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX
    });
  };

  const handleMouseLeave = () => {
    setHoveredCommentId(null);
    setTooltipPosition(null);
  };

  if (!course) return null;

  const requests = course.placementRequests;

  // Separate active from canceled/completed/rejected
  const activeRequests = requests.filter(r =>
    r.status !== 'cancelled' &&
    r.status !== 'completed' &&
    r.status !== 'rejected-by-student' &&
    r.status !== 'rejected-by-industry'
  );
  const canceledCompletedRequests = requests.filter(r =>
    r.status === 'cancelled' ||
    r.status === 'completed' ||
    r.status === 'rejected-by-student' ||
    r.status === 'rejected-by-industry'
  ).sort((a, b) => {
    // Sort by created date in reverse chronological order (newest first)
    const dateA = new Date(a.createdDate || a.requestDate);
    const dateB = new Date(b.createdDate || b.requestDate);
    return dateB.getTime() - dateA.getTime();
  });

  const selectedRequestData = requests.find(r => r.id === selectedRequest);

  // Business Rule: Can only create new request if first request is "placement-started" or "cancelled"
  const firstRequest = requests[0];
  const canCreateNewRequest = firstRequest && (
    firstRequest.status === "placement-started" ||
    firstRequest.status === "cancelled" ||
    firstRequest.status === "completed"
  );

  // Calculate statistics
  const completedCount = canceledCompletedRequests.filter(r => r.status === 'completed').length;
  const cancelledCount = canceledCompletedRequests.filter(r => r.status === 'cancelled').length;
  const rejectedCount = canceledCompletedRequests.filter(r => r.status === 'rejected-by-student' || r.status === 'rejected-by-industry').length;

  return (
    <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Compact Header */}
      <div className="bg-linear-to-r from-[#044866] to-[#0D5468] px-3 py-2.5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Building2 className="w-3 h-3 text-white" />
            </div>
            <div>
              <h3 className="text-white text-sm font-semibold">Placement History</h3>
            </div>
          </div>
        </div>

        {!canCreateNewRequest && (
          <div className="mt-2 bg-amber-500/20 backdrop-blur-sm border border-amber-400/30 rounded px-2 py-1 flex items-center gap-1.5">
            <AlertCircle className="w-3 h-3 text-amber-200 shrink-0" />
            <span className="text-amber-100 text-[10px]">First placement must start before creating new request</span>
          </div>
        )}
      </div>

      {/* Canceled/Completed Requests List */}
      {!selectedRequest && canceledCompletedRequests.length > 0 && (
        <div className="bg-white">
          <button
            onClick={() => setShowCanceledCompleted(!showCanceledCompleted)}
            className="w-full px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition-all group border-b border-slate-100"
          >
            <div className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded ${showCanceledCompleted ? 'bg-linear-to-br from-[#044866] to-[#0D5468]' : 'bg-slate-100'} flex items-center justify-center transition-all`}>
                <FileText className={`w-3 h-3 ${showCanceledCompleted ? 'text-white' : 'text-slate-600'}`} />
              </div>
              <span className="text-xs text-slate-900 font-medium">View All ({canceledCompletedRequests.length})</span>
            </div>
            <ChevronRight className={`w-4 h-4 text-slate-400 group-hover:text-[#044866] transition-all ${showCanceledCompleted ? 'rotate-90' : ''}`} />
          </button>

          {showCanceledCompleted && (
            <div className="p-2.5 bg-slate-50/50 space-y-1.5">{canceledCompletedRequests.map((request, index) => {
              const statusConfig = {
                cancelled: { icon: XCircle, label: 'Cancelled', color: 'red' },
                completed: { icon: CheckCircle, label: 'Completed', color: 'emerald' },
                'rejected-by-student': { icon: X, label: 'Rejected by Student', color: 'orange' },
                'rejected-by-industry': { icon: X, label: 'Rejected by Industry', color: 'purple' }
              }[request.status] || { icon: XCircle, label: 'Cancelled', color: 'red' };

              const StatusIcon = statusConfig.icon;
              const isCancelled = request.status === 'cancelled';
              const isCompleted = request.status === 'completed';
              const isRejectedByStudent = request.status === 'rejected-by-student';
              const isRejectedByIndustry = request.status === 'rejected-by-industry';

              // Determine colors based on status
              let iconBg = 'bg-linear-to-br from-red-500 to-red-600';
              let badgeClass = 'bg-red-50 text-red-700 border-red-200';
              let accentColor = 'bg-red-500';

              if (isCompleted) {
                iconBg = 'bg-linear-to-br from-emerald-500 to-emerald-600';
                badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                accentColor = 'bg-emerald-500';
              } else if (isRejectedByStudent) {
                iconBg = 'bg-linear-to-br from-orange-500 to-orange-600';
                badgeClass = 'bg-orange-50 text-orange-700 border-orange-200';
                accentColor = 'bg-orange-500';
              } else if (isRejectedByIndustry) {
                iconBg = 'bg-linear-to-br from-purple-500 to-purple-600';
                badgeClass = 'bg-purple-50 text-purple-700 border-purple-200';
                accentColor = 'bg-purple-500';
              }

              // Calculate placement number
              const totalPlacements = activeRequests.length + canceledCompletedRequests.length;
              const placementNumber = totalPlacements - activeRequests.length - index;

              return (
                <div
                  key={request.id}
                  onClick={() => setSelectedRequest(request.id)}
                  className="group relative bg-white rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer overflow-hidden"
                >
                  {/* Compact Layout */}
                  <div className="flex items-center gap-2 p-2">
                    {/* Number Badge */}
                    <div className="w-5 h-5 rounded bg-slate-700 flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                      #{placementNumber}
                    </div>

                    {/* Status Icon */}
                    <div className={`w-6 h-6 rounded ${iconBg} flex items-center justify-center text-white shrink-0`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                    </div>

                    {/* Main Content - Condensed */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[11px] text-slate-900 font-medium truncate">{request.workplace}</span>
                        {request.cancellationComment && (
                          <div className="relative shrink-0">
                            <div
                              className="w-4 h-4 rounded-full bg-[#044866] hover:bg-[#0D5468] flex items-center justify-center cursor-help transition-all"
                              onMouseEnter={(e) => handleMouseEnter(e, request.id)}
                              onMouseLeave={handleMouseLeave}
                            >
                              <Info className="w-2.5 h-2.5 text-white" />
                            </div>
                            {hoveredCommentId === request.id && tooltipPosition && (
                              <div className="fixed z-9999" style={{
                                left: `${tooltipPosition.left}px`,
                                top: `${tooltipPosition.top}px`
                              }}>
                                <div className="bg-slate-900 text-white text-xs rounded-lg p-3 shadow-2xl border border-slate-700 w-72">
                                  <div className="flex items-start gap-2">
                                    <div className="w-6 h-6 rounded bg-[#F7A619] flex items-center justify-center shrink-0">
                                      <Info className="w-3 h-3 text-white" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-semibold mb-1.5">{isCancelled ? 'Cancellation' : 'Rejection'} Reason</p>
                                      <p className="text-slate-300 leading-relaxed text-[11px]">{request.cancellationComment}</p>
                                    </div>
                                  </div>
                                  <div className="absolute -top-1.5 left-3 w-3 h-3 bg-slate-900 border-l border-t border-slate-700 transform rotate-45"></div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[9px] text-slate-500">
                        <Badge outline className="text-[9px] px-1 py-0 h-3.5 border-slate-300">{request.id}</Badge>
                        <Badge className={`text-[8px] px-1 py-0 h-3.5 ${badgeClass}`}>
                          {statusConfig.label}
                        </Badge>
                        <span>•</span>
                        <span className="truncate">{request.location}</span>
                        <span>•</span>
                        <span className="text-[#F7A619] font-semibold">{request.distance}</span>
                      </div>
                      {/* Dates Row */}
                      <div className="flex items-center gap-1.5 text-[9px] text-slate-400 mt-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        <span>Created: {request.createdDate}</span>
                        <span>•</span>
                        <span>Last Action: {request.lastActionDate}</span>
                        <span>•</span>
                        <User className="w-2.5 h-2.5" />
                        <span>Assigned to: <span className="font-semibold text-slate-600">{request.assignedTo}</span></span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="shrink-0">
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#044866] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          )}
        </div>
      )}

      {/* Detailed Request View */}
      {selectedRequest && selectedRequestData && (
        <div className="p-4">
          <Button
            outline
            onClick={() => setSelectedRequest(null)}
            className="mb-4 text-xs"
          >
            <ChevronRight className="w-3 h-3 mr-1 rotate-180" />
            Back
          </Button>

          <div className="space-y-4">
            {/* Header */}
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-slate-900">{selectedRequestData.workplace}</h4>
                    <Badge outline className="text-xs">{selectedRequestData.id}</Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{selectedRequestData.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {(() => {
                      const statusConfig = getStatusConfig(selectedRequestData.status);
                      const StatusIcon = statusConfig.icon;
                      return (
                        <Badge className={`${statusConfig.bgColor} ${statusConfig.textColor} text-xs`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig.label}
                        </Badge>
                      );
                    })()}
                    {selectedRequestData.priority === "high" && (
                      <Badge className="bg-[#F7A619] text-white text-xs">High Priority</Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">{selectedRequestData.nextAction}</span>
                  <span className="text-[#044866] font-medium">{selectedRequestData.progress}%</span>
                </div>
                <Progress value={selectedRequestData.progress} className="h-2" />
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3">
              {selectedRequestData.createdDate && (
                <div className="flex items-center gap-2 bg-linear-to-br from-[#044866]/5 to-[#0D5468]/5 rounded-lg p-3 text-sm border border-[#044866]/20">
                  <Calendar className="w-4 h-4 text-[#044866]" />
                  <div>
                    <p className="text-xs text-slate-500">Created</p>
                    <p className="text-slate-900 font-medium">{selectedRequestData.createdDate}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-3 text-sm">
                <Calendar className="w-4 h-4 text-[#0D5468]" />
                <div>
                  <p className="text-xs text-slate-500">Requested</p>
                  <p className="text-slate-900">{selectedRequestData.requestDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-3 text-sm">
                <Clock className="w-4 h-4 text-[#F7A619]" />
                <div>
                  <p className="text-xs text-slate-500">Due Date</p>
                  <p className="text-slate-900">{selectedRequestData.dueDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-3 text-sm">
                <MapPin className="w-4 h-4 text-[#0D5468]" />
                <div>
                  <p className="text-xs text-slate-500">Location</p>
                  <p className="text-slate-900">{selectedRequestData.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-3 text-sm">
                <FileText className="w-4 h-4 text-purple-600" />
                <div>
                  <p className="text-xs text-slate-500">Hours</p>
                  <p className="text-slate-900">{selectedRequestData.hours}</p>
                </div>
              </div>
            </div>

            {/* Actioned By (for cancelled/rejected requests) */}
            {selectedRequestData.actionedBy && (
              <div className="bg-linear-to-r from-slate-50 to-slate-100/50 rounded-lg p-4 border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#044866] to-[#0D5468] flex items-center justify-center text-white shadow-lg">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 mb-0.5">Actioned By</p>
                    <p className="text-slate-900 font-medium">{selectedRequestData.actionedByName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge outline className="text-[10px] px-1.5 py-0 h-4">
                        {selectedRequestData.actionedBy}
                      </Badge>
                      <span className="text-[10px] text-slate-500">• {selectedRequestData.actionedByAccount}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Action Date</p>
                    <p className="text-slate-900 text-sm">{selectedRequestData.actionDate}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Supervisor */}
            {selectedRequestData.supervisor !== "TBD" && (
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-sm text-slate-900 mb-3 font-medium">Supervisor: {selectedRequestData.supervisor}</p>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-3 h-3" />
                    {selectedRequestData.supervisorEmail}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-3 h-3" />
                    {selectedRequestData.supervisorPhone}
                  </div>
                </div>
              </div>
            )}

            {/* Steps */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                <p className="text-xs text-slate-900 mb-2 font-medium">Completed ({selectedRequestData.completedSteps.length})</p>
                <div className="space-y-1">
                  {selectedRequestData.completedSteps.slice(0, 3).map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-xs text-slate-900 mb-2 font-medium">Pending ({selectedRequestData.pendingSteps.length})</p>
                <div className="space-y-1">
                  {selectedRequestData.pendingSteps.slice(0, 3).map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                      <Clock className="w-3 h-3 text-blue-600" />
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button className="bg-[#044866] hover:bg-[#0D5468] text-xs">
                Continue
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
              <Button outline className="text-xs">
                Contact
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}