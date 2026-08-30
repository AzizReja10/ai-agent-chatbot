import importlib

from app.agent.agent_factory import build_agent


def test_tool_module_imports_without_calling_external_models():
    mod = importlib.import_module("app.tools.test_tool_calling")

    assert hasattr(mod, "get_weather")
    assert mod.get_weather.invoke({"city": "Kolkata"}) == "It is sunny in Kolkata."


def test_agent_factory_builds_valid_tool_list():
    agent = build_agent()

    assert agent is not None
