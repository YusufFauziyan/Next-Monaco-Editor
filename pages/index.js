import { useEffect, useRef, useState } from "react";
import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";
import { FaLanguage } from "react-icons/fa";

const ChangeLanguage = (language) => {
  loader.init().then((monaco) => {
    monaco.languages.register({ id: language });

    // Define your language syntax highlighting rules
    monaco.languages.setMonarchTokensProvider(language, {
      tokenizer: {
        root: [
          [/[a-z_$][\w$]*/, { token: "variable" }],
          [/[A-Z][\w$]*/, { token: "type.identifier" }],
          [/\d+/, { token: "number" }],
          [/#.*$/, { token: "comment" }],
          [/".*?"/, { token: "string" }],
          [/'(\\.|[^'])*'/, { token: "string" }],
          [/[=+\-*/<>&|]/, { token: "operator" }],
          [/\s+/, { token: "white" }],
        ],
      },
    });

    // Define your language completion provider
    monaco.languages.registerCompletionItemProvider("python", {
      provideCompletionItems: (model, position) => {
        const suggestions = [
          {
            label: "print",
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: "print('${1}')",
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: "Prints a message to the console.",
          },
          {
            label: "for",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "for ${1:item} in ${2:iterable}:\n\t${3:pass}",
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: "A for loop that iterates over an iterable.",
          },
          // Add more suggestions here
        ];

        return {
          suggestions: suggestions,
        };
      },
    });
  });
};

export default function Home() {
  const monaco = useMonaco();
  const editorRef = useRef(null);

  const [listLanguages, setListLanguages] = useState([]);
  const [language, setLanguage] = useState("javascript");

  function handleEditorChange(value, event) {
    // here is the current value
  }

  function handleEditorDidMount(editor, monaco) {
    // console.log("onMount: the editor instance:", editor);
    // console.log("onMount: the monaco instance:", monaco);
    editorRef.current = editor;
  }

  function handleEditorWillMount(mount) {
    // Load Python language features
  }

  function handleEditorValidation(markers) {
    // model markers
    markers.forEach((marker) => console.log("onValidate:", marker.message));
  }

  useEffect(() => {
    if (monaco) {
      setListLanguages(monaco.languages.getLanguages());
    }
  }, [monaco]);

  const handleChangeLanguage = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    ChangeLanguage(selectedLanguage);

    if (editorRef.current) {
      monaco.editor.setModelLanguage(
        editorRef.current.getModel(),
        selectedLanguage
      );
    }
  };

  console.log(language);

  return (
    <>
      <div className="flex h-[100vh]">
        {/* <div className="w-[300px] flex items-center justify-center">
          Sidebar
        </div> */}
        <div className="w-full flex flex-col justify-evenly">
          <div className="flex justify-between px-[2%]">
            <p className="font-semibold text-xl">MONCAO EDITOR</p>
            <div className="flex items-center gap-2">
              <FaLanguage className="w-8 h-8" />
              <select
                className="text-black w-[100px] rounded px-2 py-0.5 focus:outline-none"
                onChange={handleChangeLanguage}
                value={language}
              >
                {listLanguages.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.id}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="w-full flex items-center bg-white py-2">
            <Editor
              height="90vh"
              defaultLanguage={language} // Change the default language to "python"
              defaultValue="// some comment"
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
              beforeMount={handleEditorWillMount}
              onValidate={handleEditorValidation}
              value={language}
            />
          </div>
        </div>
      </div>
    </>
  );
}
