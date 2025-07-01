import datetime

from autoagent_api import common_pb2 as _common_pb2
from buf.validate import validate_pb2 as _validate_pb2
from google.protobuf import duration_pb2 as _duration_pb2
from google.protobuf.internal import enum_type_wrapper as _enum_type_wrapper
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from collections.abc import Mapping as _Mapping
from typing import ClassVar as _ClassVar, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class FinalStatus(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = ()
    FINAL_STATUS_UNSPECIFIED: _ClassVar[FinalStatus]
    FINAL_STATUS_SUCCESS: _ClassVar[FinalStatus]
    FINAL_STATUS_FAILURE: _ClassVar[FinalStatus]
FINAL_STATUS_UNSPECIFIED: FinalStatus
FINAL_STATUS_SUCCESS: FinalStatus
FINAL_STATUS_FAILURE: FinalStatus

class StartSessionRequest(_message.Message):
    __slots__ = ("request_id", "agent_profile", "initial_workspace")
    REQUEST_ID_FIELD_NUMBER: _ClassVar[int]
    AGENT_PROFILE_FIELD_NUMBER: _ClassVar[int]
    INITIAL_WORKSPACE_FIELD_NUMBER: _ClassVar[int]
    request_id: str
    agent_profile: _common_pb2.AgentProfile
    initial_workspace: _common_pb2.WorkspaceReference
    def __init__(self, request_id: _Optional[str] = ..., agent_profile: _Optional[_Union[_common_pb2.AgentProfile, _Mapping]] = ..., initial_workspace: _Optional[_Union[_common_pb2.WorkspaceReference, _Mapping]] = ...) -> None: ...

class StartSessionResponse(_message.Message):
    __slots__ = ("session_id",)
    SESSION_ID_FIELD_NUMBER: _ClassVar[int]
    session_id: str
    def __init__(self, session_id: _Optional[str] = ...) -> None: ...

class StopSessionRequest(_message.Message):
    __slots__ = ("request_id", "session_id", "final_status", "commit_message")
    REQUEST_ID_FIELD_NUMBER: _ClassVar[int]
    SESSION_ID_FIELD_NUMBER: _ClassVar[int]
    FINAL_STATUS_FIELD_NUMBER: _ClassVar[int]
    COMMIT_MESSAGE_FIELD_NUMBER: _ClassVar[int]
    request_id: str
    session_id: str
    final_status: FinalStatus
    commit_message: str
    def __init__(self, request_id: _Optional[str] = ..., session_id: _Optional[str] = ..., final_status: _Optional[_Union[FinalStatus, str]] = ..., commit_message: _Optional[str] = ...) -> None: ...

class StopSessionResponse(_message.Message):
    __slots__ = ("final_workspace",)
    FINAL_WORKSPACE_FIELD_NUMBER: _ClassVar[int]
    final_workspace: _common_pb2.WorkspaceReference
    def __init__(self, final_workspace: _Optional[_Union[_common_pb2.WorkspaceReference, _Mapping]] = ...) -> None: ...

class ExecuteStepRequest(_message.Message):
    __slots__ = ("request_id", "session_id", "directive", "timeout")
    REQUEST_ID_FIELD_NUMBER: _ClassVar[int]
    SESSION_ID_FIELD_NUMBER: _ClassVar[int]
    DIRECTIVE_FIELD_NUMBER: _ClassVar[int]
    TIMEOUT_FIELD_NUMBER: _ClassVar[int]
    request_id: str
    session_id: str
    directive: str
    timeout: _duration_pb2.Duration
    def __init__(self, request_id: _Optional[str] = ..., session_id: _Optional[str] = ..., directive: _Optional[str] = ..., timeout: _Optional[_Union[datetime.timedelta, _duration_pb2.Duration, _Mapping]] = ...) -> None: ...

class ExecuteStepResponse(_message.Message):
    __slots__ = ("log_chunk", "result", "error")
    LOG_CHUNK_FIELD_NUMBER: _ClassVar[int]
    RESULT_FIELD_NUMBER: _ClassVar[int]
    ERROR_FIELD_NUMBER: _ClassVar[int]
    log_chunk: LogChunk
    result: StepResult
    error: _common_pb2.Error
    def __init__(self, log_chunk: _Optional[_Union[LogChunk, _Mapping]] = ..., result: _Optional[_Union[StepResult, _Mapping]] = ..., error: _Optional[_Union[_common_pb2.Error, _Mapping]] = ...) -> None: ...

class StepResult(_message.Message):
    __slots__ = ("summary", "status", "last_stdout", "last_stderr")
    SUMMARY_FIELD_NUMBER: _ClassVar[int]
    STATUS_FIELD_NUMBER: _ClassVar[int]
    LAST_STDOUT_FIELD_NUMBER: _ClassVar[int]
    LAST_STDERR_FIELD_NUMBER: _ClassVar[int]
    summary: str
    status: _common_pb2.ExecutionStatus
    last_stdout: str
    last_stderr: str
    def __init__(self, summary: _Optional[str] = ..., status: _Optional[_Union[_common_pb2.ExecutionStatus, str]] = ..., last_stdout: _Optional[str] = ..., last_stderr: _Optional[str] = ...) -> None: ...

class LogChunk(_message.Message):
    __slots__ = ("stream", "content")
    class Stream(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
        __slots__ = ()
        STREAM_UNSPECIFIED: _ClassVar[LogChunk.Stream]
        STREAM_STDOUT: _ClassVar[LogChunk.Stream]
        STREAM_STDERR: _ClassVar[LogChunk.Stream]
    STREAM_UNSPECIFIED: LogChunk.Stream
    STREAM_STDOUT: LogChunk.Stream
    STREAM_STDERR: LogChunk.Stream
    STREAM_FIELD_NUMBER: _ClassVar[int]
    CONTENT_FIELD_NUMBER: _ClassVar[int]
    stream: LogChunk.Stream
    content: bytes
    def __init__(self, stream: _Optional[_Union[LogChunk.Stream, str]] = ..., content: _Optional[bytes] = ...) -> None: ...
