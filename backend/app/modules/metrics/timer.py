import time


class Timer:

    def __init__(self):

        self.start = 0

    def begin(self):

        self.start = time.perf_counter()

    def end(self):

        return round(

            time.perf_counter() - self.start,

            4

        )