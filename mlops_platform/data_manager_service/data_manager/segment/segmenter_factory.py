
from data_manager.segment.web_rtc_segmenter import WebRTCSegmenter
from data_manager.segment.forced_alignment_segmenter import ForcedAlignmentSegmenter

class SegmenterFactory:
    def __init__(self, config):
        self.config = config

    def create(self):
        if self.config["segment"]["type"] == "webrtc":
            return WebRTCSegmenter(self.config)
        if self.config["segment"]["type"] == "forced-alignment":
            return ForcedAlignmentSegmenter(self.config)

        assert False


