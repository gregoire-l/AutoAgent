from buf.validate import validate_pb2 as _validate_pb2
from google.protobuf.internal import containers as _containers
from google.protobuf.internal import enum_type_wrapper as _enum_type_wrapper
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from collections.abc import Iterable as _Iterable, Mapping as _Mapping
from typing import ClassVar as _ClassVar, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class ExecutionStatus(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = ()
    EXECUTION_STATUS_UNSPECIFIED: _ClassVar[ExecutionStatus]
    EXECUTION_STATUS_SUCCESS: _ClassVar[ExecutionStatus]
    EXECUTION_STATUS_FAILURE: _ClassVar[ExecutionStatus]
    EXECUTION_STATUS_TIMEOUT: _ClassVar[ExecutionStatus]
EXECUTION_STATUS_UNSPECIFIED: ExecutionStatus
EXECUTION_STATUS_SUCCESS: ExecutionStatus
EXECUTION_STATUS_FAILURE: ExecutionStatus
EXECUTION_STATUS_TIMEOUT: ExecutionStatus

class WorkspaceReference(_message.Message):
    __slots__ = ("repository", "branch", "commit_id")
    REPOSITORY_FIELD_NUMBER: _ClassVar[int]
    BRANCH_FIELD_NUMBER: _ClassVar[int]
    COMMIT_ID_FIELD_NUMBER: _ClassVar[int]
    repository: str
    branch: str
    commit_id: str
    def __init__(self, repository: _Optional[str] = ..., branch: _Optional[str] = ..., commit_id: _Optional[str] = ...) -> None: ...

class Tool(_message.Message):
    __slots__ = ("name", "version")
    NAME_FIELD_NUMBER: _ClassVar[int]
    VERSION_FIELD_NUMBER: _ClassVar[int]
    name: str
    version: str
    def __init__(self, name: _Optional[str] = ..., version: _Optional[str] = ...) -> None: ...

class AgentProfile(_message.Message):
    __slots__ = ("profile_id", "required_tools")
    PROFILE_ID_FIELD_NUMBER: _ClassVar[int]
    REQUIRED_TOOLS_FIELD_NUMBER: _ClassVar[int]
    profile_id: str
    required_tools: _containers.RepeatedCompositeFieldContainer[Tool]
    def __init__(self, profile_id: _Optional[str] = ..., required_tools: _Optional[_Iterable[_Union[Tool, _Mapping]]] = ...) -> None: ...

class PotentialTask(_message.Message):
    __slots__ = ("id", "prompt")
    ID_FIELD_NUMBER: _ClassVar[int]
    PROMPT_FIELD_NUMBER: _ClassVar[int]
    id: str
    prompt: str
    def __init__(self, id: _Optional[str] = ..., prompt: _Optional[str] = ...) -> None: ...

class Error(_message.Message):
    __slots__ = ("code", "message")
    CODE_FIELD_NUMBER: _ClassVar[int]
    MESSAGE_FIELD_NUMBER: _ClassVar[int]
    code: int
    message: str
    def __init__(self, code: _Optional[int] = ..., message: _Optional[str] = ...) -> None: ...
