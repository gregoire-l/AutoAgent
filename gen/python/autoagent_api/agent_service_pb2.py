# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# NO CHECKED-IN PROTOBUF GENCODE
# source: autoagent_api/agent_service.proto
# Protobuf Python Version: 6.31.1
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import runtime_version as _runtime_version
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
_runtime_version.ValidateProtobufRuntimeVersion(
    _runtime_version.Domain.PUBLIC,
    6,
    31,
    1,
    '',
    'autoagent_api/agent_service.proto'
)
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()


from autoagent_api import common_pb2 as autoagent__api_dot_common__pb2
from buf.validate import validate_pb2 as buf_dot_validate_dot_validate__pb2
from google.protobuf import duration_pb2 as google_dot_protobuf_dot_duration__pb2


DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n!autoagent_api/agent_service.proto\x12\rautoagent_api\x1a\x1a\x61utoagent_api/common.proto\x1a\x1b\x62uf/validate/validate.proto\x1a\x1egoogle/protobuf/duration.proto\"\xe0\x01\n\x13StartSessionRequest\x12\'\n\nrequest_id\x18\x01 \x01(\tB\x08\xbaH\x05r\x03\xb0\x01\x01R\trequestId\x12H\n\ragent_profile\x18\x02 \x01(\x0b\x32\x1b.autoagent_api.AgentProfileB\x06\xbaH\x03\xc8\x01\x01R\x0c\x61gentProfile\x12V\n\x11initial_workspace\x18\x03 \x01(\x0b\x32!.autoagent_api.WorkspaceReferenceB\x06\xbaH\x03\xc8\x01\x01R\x10initialWorkspace\">\n\x14StartSessionResponse\x12&\n\nsession_id\x18\x01 \x01(\tB\x07\xbaH\x04r\x02\x10\x01R\tsessionId\"\xdf\x01\n\x12StopSessionRequest\x12\'\n\nrequest_id\x18\x01 \x01(\tB\x08\xbaH\x05r\x03\xb0\x01\x01R\trequestId\x12&\n\nsession_id\x18\x02 \x01(\tB\x07\xbaH\x04r\x02\x10\x01R\tsessionId\x12G\n\x0c\x66inal_status\x18\x03 \x01(\x0e\x32\x1a.autoagent_api.FinalStatusB\x08\xbaH\x05\x82\x01\x02\x10\x01R\x0b\x66inalStatus\x12/\n\x0e\x63ommit_message\x18\x04 \x01(\tB\x08\xbaH\x05r\x03\x18\x80\x02R\rcommitMessage\"a\n\x13StopSessionResponse\x12J\n\x0f\x66inal_workspace\x18\x01 \x01(\x0b\x32!.autoagent_api.WorkspaceReferenceR\x0e\x66inalWorkspace\"\xc9\x01\n\x12\x45xecuteStepRequest\x12\'\n\nrequest_id\x18\x01 \x01(\tB\x08\xbaH\x05r\x03\xb0\x01\x01R\trequestId\x12&\n\nsession_id\x18\x02 \x01(\tB\x07\xbaH\x04r\x02\x10\x01R\tsessionId\x12%\n\tdirective\x18\x03 \x01(\tB\x07\xbaH\x04r\x02\x10\nR\tdirective\x12;\n\x07timeout\x18\x04 \x01(\x0b\x32\x19.google.protobuf.DurationB\x06\xbaH\x03\xc8\x01\x01R\x07timeout\"\xc0\x01\n\x13\x45xecuteStepResponse\x12\x36\n\tlog_chunk\x18\x01 \x01(\x0b\x32\x17.autoagent_api.LogChunkH\x00R\x08logChunk\x12\x33\n\x06result\x18\x02 \x01(\x0b\x32\x19.autoagent_api.StepResultH\x00R\x06result\x12,\n\x05\x65rror\x18\x03 \x01(\x0b\x32\x14.autoagent_api.ErrorH\x00R\x05\x65rrorB\x0e\n\x05\x65vent\x12\x05\xbaH\x02\x08\x01\"\xb3\x01\n\nStepResult\x12!\n\x07summary\x18\x01 \x01(\tB\x07\xbaH\x04r\x02\x10\x05R\x07summary\x12@\n\x06status\x18\x02 \x01(\x0e\x32\x1e.autoagent_api.ExecutionStatusB\x08\xbaH\x05\x82\x01\x02\x10\x01R\x06status\x12\x1f\n\x0blast_stdout\x18\x03 \x01(\tR\nlastStdout\x12\x1f\n\x0blast_stderr\x18\x04 \x01(\tR\nlastStderr\"\xb7\x01\n\x08LogChunk\x12@\n\x06stream\x18\x01 \x01(\x0e\x32\x1e.autoagent_api.LogChunk.StreamB\x08\xbaH\x05\x82\x01\x02\x10\x01R\x06stream\x12!\n\x07\x63ontent\x18\x02 \x01(\x0c\x42\x07\xbaH\x04z\x02\x10\x01R\x07\x63ontent\"F\n\x06Stream\x12\x16\n\x12STREAM_UNSPECIFIED\x10\x00\x12\x11\n\rSTREAM_STDOUT\x10\x01\x12\x11\n\rSTREAM_STDERR\x10\x02*_\n\x0b\x46inalStatus\x12\x1c\n\x18\x46INAL_STATUS_UNSPECIFIED\x10\x00\x12\x18\n\x14\x46INAL_STATUS_SUCCESS\x10\x01\x12\x18\n\x14\x46INAL_STATUS_FAILURE\x10\x02\x32\x9e\x02\n\x13\x41gentSessionService\x12W\n\x0cStartSession\x12\".autoagent_api.StartSessionRequest\x1a#.autoagent_api.StartSessionResponse\x12X\n\x0b\x45xecuteStep\x12!.autoagent_api.ExecuteStepRequest\x1a\".autoagent_api.ExecuteStepResponse(\x01\x30\x01\x12T\n\x0bStopSession\x12!.autoagent_api.StopSessionRequest\x1a\".autoagent_api.StopSessionResponseB\x85\x01\n\x11\x63om.autoagent_apiB\x11\x41gentServiceProtoP\x01Z\rautoagent/api\xa2\x02\x03\x41XX\xaa\x02\x0c\x41utoagentApi\xca\x02\x0c\x41utoagentApi\xe2\x02\x18\x41utoagentApi\\GPBMetadata\xea\x02\x0c\x41utoagentApib\x06proto3')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'autoagent_api.agent_service_pb2', _globals)
if not _descriptor._USE_C_DESCRIPTORS:
  _globals['DESCRIPTOR']._loaded_options = None
  _globals['DESCRIPTOR']._serialized_options = b'\n\021com.autoagent_apiB\021AgentServiceProtoP\001Z\rautoagent/api\242\002\003AXX\252\002\014AutoagentApi\312\002\014AutoagentApi\342\002\030AutoagentApi\\GPBMetadata\352\002\014AutoagentApi'
  _globals['_STARTSESSIONREQUEST'].fields_by_name['request_id']._loaded_options = None
  _globals['_STARTSESSIONREQUEST'].fields_by_name['request_id']._serialized_options = b'\272H\005r\003\260\001\001'
  _globals['_STARTSESSIONREQUEST'].fields_by_name['agent_profile']._loaded_options = None
  _globals['_STARTSESSIONREQUEST'].fields_by_name['agent_profile']._serialized_options = b'\272H\003\310\001\001'
  _globals['_STARTSESSIONREQUEST'].fields_by_name['initial_workspace']._loaded_options = None
  _globals['_STARTSESSIONREQUEST'].fields_by_name['initial_workspace']._serialized_options = b'\272H\003\310\001\001'
  _globals['_STARTSESSIONRESPONSE'].fields_by_name['session_id']._loaded_options = None
  _globals['_STARTSESSIONRESPONSE'].fields_by_name['session_id']._serialized_options = b'\272H\004r\002\020\001'
  _globals['_STOPSESSIONREQUEST'].fields_by_name['request_id']._loaded_options = None
  _globals['_STOPSESSIONREQUEST'].fields_by_name['request_id']._serialized_options = b'\272H\005r\003\260\001\001'
  _globals['_STOPSESSIONREQUEST'].fields_by_name['session_id']._loaded_options = None
  _globals['_STOPSESSIONREQUEST'].fields_by_name['session_id']._serialized_options = b'\272H\004r\002\020\001'
  _globals['_STOPSESSIONREQUEST'].fields_by_name['final_status']._loaded_options = None
  _globals['_STOPSESSIONREQUEST'].fields_by_name['final_status']._serialized_options = b'\272H\005\202\001\002\020\001'
  _globals['_STOPSESSIONREQUEST'].fields_by_name['commit_message']._loaded_options = None
  _globals['_STOPSESSIONREQUEST'].fields_by_name['commit_message']._serialized_options = b'\272H\005r\003\030\200\002'
  _globals['_EXECUTESTEPREQUEST'].fields_by_name['request_id']._loaded_options = None
  _globals['_EXECUTESTEPREQUEST'].fields_by_name['request_id']._serialized_options = b'\272H\005r\003\260\001\001'
  _globals['_EXECUTESTEPREQUEST'].fields_by_name['session_id']._loaded_options = None
  _globals['_EXECUTESTEPREQUEST'].fields_by_name['session_id']._serialized_options = b'\272H\004r\002\020\001'
  _globals['_EXECUTESTEPREQUEST'].fields_by_name['directive']._loaded_options = None
  _globals['_EXECUTESTEPREQUEST'].fields_by_name['directive']._serialized_options = b'\272H\004r\002\020\n'
  _globals['_EXECUTESTEPREQUEST'].fields_by_name['timeout']._loaded_options = None
  _globals['_EXECUTESTEPREQUEST'].fields_by_name['timeout']._serialized_options = b'\272H\003\310\001\001'
  _globals['_EXECUTESTEPRESPONSE'].oneofs_by_name['event']._loaded_options = None
  _globals['_EXECUTESTEPRESPONSE'].oneofs_by_name['event']._serialized_options = b'\272H\002\010\001'
  _globals['_STEPRESULT'].fields_by_name['summary']._loaded_options = None
  _globals['_STEPRESULT'].fields_by_name['summary']._serialized_options = b'\272H\004r\002\020\005'
  _globals['_STEPRESULT'].fields_by_name['status']._loaded_options = None
  _globals['_STEPRESULT'].fields_by_name['status']._serialized_options = b'\272H\005\202\001\002\020\001'
  _globals['_LOGCHUNK'].fields_by_name['stream']._loaded_options = None
  _globals['_LOGCHUNK'].fields_by_name['stream']._serialized_options = b'\272H\005\202\001\002\020\001'
  _globals['_LOGCHUNK'].fields_by_name['content']._loaded_options = None
  _globals['_LOGCHUNK'].fields_by_name['content']._serialized_options = b'\272H\004z\002\020\001'
  _globals['_FINALSTATUS']._serialized_start=1524
  _globals['_FINALSTATUS']._serialized_end=1619
  _globals['_STARTSESSIONREQUEST']._serialized_start=142
  _globals['_STARTSESSIONREQUEST']._serialized_end=366
  _globals['_STARTSESSIONRESPONSE']._serialized_start=368
  _globals['_STARTSESSIONRESPONSE']._serialized_end=430
  _globals['_STOPSESSIONREQUEST']._serialized_start=433
  _globals['_STOPSESSIONREQUEST']._serialized_end=656
  _globals['_STOPSESSIONRESPONSE']._serialized_start=658
  _globals['_STOPSESSIONRESPONSE']._serialized_end=755
  _globals['_EXECUTESTEPREQUEST']._serialized_start=758
  _globals['_EXECUTESTEPREQUEST']._serialized_end=959
  _globals['_EXECUTESTEPRESPONSE']._serialized_start=962
  _globals['_EXECUTESTEPRESPONSE']._serialized_end=1154
  _globals['_STEPRESULT']._serialized_start=1157
  _globals['_STEPRESULT']._serialized_end=1336
  _globals['_LOGCHUNK']._serialized_start=1339
  _globals['_LOGCHUNK']._serialized_end=1522
  _globals['_LOGCHUNK_STREAM']._serialized_start=1452
  _globals['_LOGCHUNK_STREAM']._serialized_end=1522
  _globals['_AGENTSESSIONSERVICE']._serialized_start=1622
  _globals['_AGENTSESSIONSERVICE']._serialized_end=1908
# @@protoc_insertion_point(module_scope)
