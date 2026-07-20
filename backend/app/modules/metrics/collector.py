from app.modules.metrics.system import SystemMetrics
from app.modules.metrics.timer import Timer
from app.modules.metrics.api_cost import ApiCost


class MetricsCollector:

    def __init__(self):
        self.timer = Timer()

    def start(self):
        self.timer.start()

    def finish(self, usage_metadata=None):

        api_cost = 0.0

        if usage_metadata is not None:
            api_cost = ApiCost.calculate(
                usage_metadata.prompt_token_count,
                usage_metadata.candidates_token_count
            )

        return {
            "latency": self.timer.stop(),
            "cpu": SystemMetrics.cpu(),
            "memory": SystemMetrics.memory(),
            "gpu": None,
            "api_cost": api_cost
        }