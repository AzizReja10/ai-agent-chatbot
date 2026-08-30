import importlib


def test_tool_module_imports_without_calling_external_models():
    mod = importlib.import_module("app.tools.test_tool_calling")

    assert hasattr(mod, "get_weather")
    assert mod.get_weather.invoke({"city": "Kolkata"}) == "It is sunny in Kolkata."
