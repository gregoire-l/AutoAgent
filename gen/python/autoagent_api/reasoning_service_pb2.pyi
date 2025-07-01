from autoagent_api import common_pb2 as _common_pb2
from buf.validate import validate_pb2 as _validate_pb2
from google.protobuf.internal import containers as _containers
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from collections.abc import Iterable as _Iterable, Mapping as _Mapping
from typing import ClassVar as _ClassVar, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class GenerateOptionsRequest(_message.Message):
    __slots__ = ("request_id", "mission_id", "current_task_prompt", "factual_context", "generation_directive")
    REQUEST_ID_FIELD_NUMBER: _ClassVar[int]
    MISSION_ID_FIELD_NUMBER: _ClassVar[int]
    CURRENT_TASK_PROMPT_FIELD_NUMBER: _ClassVar[int]
    FACTUAL_CONTEXT_FIELD_NUMBER: _ClassVar[int]
    GENERATION_DIRECTIVE_FIELD_NUMBER: _ClassVar[int]
    request_id: str
    mission_id: str
    current_task_prompt: str
    factual_context: str
    generation_directive: str
    def __init__(self, request_id: _Optional[str] = ..., mission_id: _Optional[str] = ..., current_task_prompt: _Optional[str] = ..., factual_context: _Optional[str] = ..., generation_directive: _Optional[str] = ...) -> None: ...

class GenerateOptionsResponse(_message.Message):
    __slots__ = ("potential_tasks",)
    POTENTIAL_TASKS_FIELD_NUMBER: _ClassVar[int]
    potential_tasks: _containers.RepeatedCompositeFieldContainer[_common_pb2.PotentialTask]
    def __init__(self, potential_tasks: _Optional[_Iterable[_Union[_common_pb2.PotentialTask, _Mapping]]] = ...) -> None: ...

class ScoreOptionsRequest(_message.Message):
    __slots__ = ("request_id", "mission_id", "shared_context", "tasks_to_score")
    REQUEST_ID_FIELD_NUMBER: _ClassVar[int]
    MISSION_ID_FIELD_NUMBER: _ClassVar[int]
    SHARED_CONTEXT_FIELD_NUMBER: _ClassVar[int]
    TASKS_TO_SCORE_FIELD_NUMBER: _ClassVar[int]
    request_id: str
    mission_id: str
    shared_context: str
    tasks_to_score: _containers.RepeatedCompositeFieldContainer[_common_pb2.PotentialTask]
    def __init__(self, request_id: _Optional[str] = ..., mission_id: _Optional[str] = ..., shared_context: _Optional[str] = ..., tasks_to_score: _Optional[_Iterable[_Union[_common_pb2.PotentialTask, _Mapping]]] = ...) -> None: ...

class ScoreOptionsResponse(_message.Message):
    __slots__ = ("results",)
    RESULTS_FIELD_NUMBER: _ClassVar[int]
    results: _containers.RepeatedCompositeFieldContainer[ScoreResult]
    def __init__(self, results: _Optional[_Iterable[_Union[ScoreResult, _Mapping]]] = ...) -> None: ...

class ScoreResult(_message.Message):
    __slots__ = ("id", "success", "error")
    ID_FIELD_NUMBER: _ClassVar[int]
    SUCCESS_FIELD_NUMBER: _ClassVar[int]
    ERROR_FIELD_NUMBER: _ClassVar[int]
    id: str
    success: ScoredOption
    error: _common_pb2.Error
    def __init__(self, id: _Optional[str] = ..., success: _Optional[_Union[ScoredOption, _Mapping]] = ..., error: _Optional[_Union[_common_pb2.Error, _Mapping]] = ...) -> None: ...

class ScoredOption(_message.Message):
    __slots__ = ("score", "rationale", "model_confidence")
    SCORE_FIELD_NUMBER: _ClassVar[int]
    RATIONALE_FIELD_NUMBER: _ClassVar[int]
    MODEL_CONFIDENCE_FIELD_NUMBER: _ClassVar[int]
    score: Score
    rationale: str
    model_confidence: float
    def __init__(self, score: _Optional[_Union[Score, _Mapping]] = ..., rationale: _Optional[str] = ..., model_confidence: _Optional[float] = ...) -> None: ...

class Score(_message.Message):
    __slots__ = ("predicted_complexity", "predicted_success_probability", "predicted_cost")
    PREDICTED_COMPLEXITY_FIELD_NUMBER: _ClassVar[int]
    PREDICTED_SUCCESS_PROBABILITY_FIELD_NUMBER: _ClassVar[int]
    PREDICTED_COST_FIELD_NUMBER: _ClassVar[int]
    predicted_complexity: float
    predicted_success_probability: float
    predicted_cost: float
    def __init__(self, predicted_complexity: _Optional[float] = ..., predicted_success_probability: _Optional[float] = ..., predicted_cost: _Optional[float] = ...) -> None: ...
