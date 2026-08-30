from langchain_core.tools import tool
from googleapiclient.discovery import build
from app.tools.google_auth import get_google_credentials


def extract_text(document):
    content = document["body"]["content"]
    text_parts = []
    for item in content:
        paragraph = item.get("paragraph")
        if not paragraph:
            continue
        for element in paragraph.get("elements", []):
            text_run = element.get("textRun")
            if text_run:
                text_parts.append(text_run["content"].replace("\n", " "))
    return "".join(text_parts)


@tool
def read_google_docs(doc_name:str)->str:
    """Find a Google Doc by its title and return its full text content.
    Use this whenever the user asks about, summarizes, references, or wants
    information from a specific named document — always fetch the content
    with this tool first before answering, never ask the user to paste text."""
    creds=get_google_credentials()
    drive_service=build("drive","v3",credentials=creds)
    docs_service=build("docs","v1",credentials=creds)
    query=f"name='{doc_name}' and mimeType= 'application/vnd.google-apps.document'"
    results=drive_service.files().list(q=query,fields="files(id,name)").execute()
    files=results.get("files",[])
    if not files:
        return f"No google doc found with the name '{doc_name}'"
    doc_id = files[0]["id"]
    document = docs_service.documents().get(documentId=doc_id).execute()
    text = extract_text(document)
    if not text.strip():
        return f"the document '{doc_name}' appears to be empty."
    return text

if __name__=="__main__":
    results=read_google_docs.invoke({"doc_name":"sbTask"})
    print(results)