import os

import psutil


class SystemMetrics:

    @staticmethod
    def cpu():

        return psutil.cpu_percent(interval=None)

    @staticmethod
    def memory():

        process = psutil.Process(os.getpid())

        return process.memory_info().rss / 1024 / 1024