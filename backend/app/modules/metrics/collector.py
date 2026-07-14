from app.modules.metrics.system import SystemMetrics

from app.modules.metrics.timer import Timer


class MetricsCollector:

    def __init__(self):

        self.timer = Timer()

    def start(self):

        self.timer.start()

    def finish(self):

        return {

            "latency": self.timer.stop(),

            "cpu": SystemMetrics.cpu(),

            "memory": SystemMetrics.memory()

        }