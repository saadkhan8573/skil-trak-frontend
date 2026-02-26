import { Badge, Button, NoData } from "@components";
import { AlertCircle, ArrowRight, CheckCheck, CheckCircle2, ChevronRight, Clock, Zap } from "lucide-react";
import { RtoV2Api } from "@queries";
import { useAppSelector } from "@redux/hooks";
import { motion, AnimatePresence } from "framer-motion";

export function HighlightedTasks() {
  const { selectedWorkplace } = useAppSelector((state) => state?.student);

  const { data: highlightedData, isLoading } = RtoV2Api.PlacementRequests.useIndustryPlacementHighlightedTasks(
    selectedWorkplace?.id,
    { skip: !selectedWorkplace?.id }
  );

  const [confirmTasks, { isLoading: isConfirming }] = RtoV2Api.PlacementRequests.useConfirmHighlightedTask();

  const tasks = highlightedData?.highlightedTasks || [];
  const isString = highlightedData?.isString;
  const isConfirmed = isString
    ? Boolean(highlightedData?.courseConfigurationDetail?.highlightedTask?.isConfirmed)
    : tasks.length > 0 && tasks.every((task: any) => task.isConfirmed);

  const handleConfirm = () => {
    if (tasks.length > 0) {
      const confirmId = isString
        ? highlightedData?.courseConfigurationDetail?.highlightedTask?.id
        : tasks[0].id;
      if (confirmId) confirmTasks(confirmId);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/60 p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F7A619]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/60 shadow-lg shadow-slate-200/50 overflow-hidden hover:shadow-xl transition-all">
      {/* Header */}
      <div className="bg-linear-to-r from-[#F7A619] to-amber-500 px-5 py-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
        <div className="relative flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Highlighted Tasks</h3>
            <p className="text-white/80 text-xs text-nowrap">Important actions requiring your attention</p>
          </div>
          {tasks.length > 0 && (
            <Badge className="ml-auto bg-white/20 text-white border-0 text-xs px-2 py-0.5">
              {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'}
            </Badge>
          )}
        </div>
      </div>

      {/* Confirmation Section */}
      {tasks.length > 0 && (
        <div className="px-5 pt-4">
          {isConfirmed ? (
            <div className="text-xs bg-emerald-50 text-emerald-800 px-4 py-2.5 rounded-lg border border-emerald-200 flex items-center gap-2">
              <CheckCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span className="font-semibold">Confirmed with Workplace</span>
            </div>
          ) : (
            <Button
              variant="primary"
              outline
              className="w-full h-9 border-violet-200 text-violet-600 hover:bg-violet-600 hover:text-white text-xs font-semibold"
              Icon={CheckCircle2}
              onClick={handleConfirm}
              loading={isConfirming}
              disabled={isConfirming}
            >
              Confirm with Workplace
            </Button>
          )}
        </div>
      )}

      {/* Tasks List */}
      <div className="p-5 space-y-3 h-90 overflow-auto">
        {tasks.length > 0 ? (
          <AnimatePresence>
            {tasks.map((task: any, index: number) => {
              const taskText = isString ? task : (task?.courseHighlightedTask?.statement || '---');
              return (
                <motion.div
                  key={task.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-xl bg-linear-to-br from-slate-50 via-white to-slate-50 border border-slate-200 p-3.5 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="relative flex items-start gap-3">
                    {/* Icon */}
                    <div className="p-1.5 bg-[#F7A619]/10 rounded-lg mt-0.5">
                      <ChevronRight className="h-4 w-4 text-[#F7A619]" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 leading-relaxed mb-1.5">
                        {taskText}
                      </p>

                      {/* Footer / Confirmation Info */}
                      {!isString && task.isConfirmed && (
                        <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-medium">
                          <CheckCheck className="w-3 h-3" />
                          <span>
                            Confirmed by {task?.confirmedBy?.name || '---'}
                          </span>
                          <span className="text-slate-400 font-normal">
                            • {task.updatedAt ? new Date(task.updatedAt).toLocaleDateString() : '---'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        ) : (
          <NoData text="No Highlighted Tasks Found" />
        )}
      </div>
    </div>
  );
}
