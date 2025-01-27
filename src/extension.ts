import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let addSetPrefix = vscode.commands.registerCommand(
    "React-autoState.addSetPrefix",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const selection = editor.selection;
      const text = editor.document.getText(selection);

      if (!text) {
        vscode.window.showErrorMessage("Please select text 🥲");
        return;
      }

      const transformedText =
        "set" + text.charAt(0).toUpperCase() + text.slice(1);

      await vscode.env.clipboard.writeText(transformedText);
      vscode.window.showInformationMessage(
        `${transformedText} has been copied to clipboard 🥳`
      );
    }
  );

  let removeSetPrefix = vscode.commands.registerCommand(
    "React-autoState.removeSetPrefix",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const selection = editor.selection;
      const text = editor.document.getText(selection);

      if (!text || !text.startsWith("set")) {
        vscode.window.showErrorMessage(
          "Please select text that starts with 'set' 🥲"
        );
        return;
      }

      const transformedText =
        text.slice(3).charAt(0).toLowerCase() + text.slice(4);

      await vscode.env.clipboard.writeText(transformedText);
      vscode.window.showInformationMessage(
        `${transformedText} has been copied to clipboard 🥳`
      );
    }
  );

  const setterCompletionProvider =
    vscode.languages.registerCompletionItemProvider(
      [
        { scheme: "file", language: "javascript" },
        { scheme: "file", language: "javascriptreact" },
        { scheme: "file", language: "typescript" },
        { scheme: "file", language: "typescriptreact" },
      ],
      {
        provideCompletionItems(
          document: vscode.TextDocument,
          position: vscode.Position
        ) {
          const linePrefix = document
            .lineAt(position)
            .text.slice(0, position.character);

          const stateNameMatch = linePrefix.match(
            /const\s*\[\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*,\s*$/
          );

          if (!stateNameMatch) {
            return undefined;
          }

          const stateName = stateNameMatch[1];
          const setterName = `set${stateName
            .charAt(0)
            .toUpperCase()}${stateName.slice(1)}`;

          const completionItem = new vscode.CompletionItem(
            setterName,
            vscode.CompletionItemKind.Function
          );

          completionItem.insertText = setterName;
          completionItem.detail = `State setter for '${stateName}'`;
          completionItem.documentation = new vscode.MarkdownString(
            `React useState setter for \`${stateName}\``
          );

          completionItem.kind = vscode.CompletionItemKind.Method;
          completionItem.sortText = "0";
          completionItem.preselect = true;

          completionItem.command = {
            command: "editor.action.triggerSuggest",
            title: "Re-trigger completions...",
          };

          return [completionItem];
        },
      },
      ","
    );

  let createUseState = vscode.commands.registerCommand(
    "React-autoState.createUseState",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      let text;
      let line;
      let range;

      if (editor.selection.isEmpty) {
        line = editor.document.lineAt(editor.selection.active.line);
        text = line.text.trim();
        range = line.range;
      } else {
        text = editor.document.getText(editor.selection);
        line = editor.document.lineAt(editor.selection.start.line);
        range = editor.selection;
      }

      const indentation = line.text.substring(
        0,
        line.firstNonWhitespaceCharacterIndex
      );

      if (!text) {
        vscode.window.showErrorMessage(
          "Please select text or position cursor on a line 🥲"
        );
        return;
      }

      const parts = text.split("^");
      let snippet = "";

      if (parts.length === 1) {
        const setterName = "set" + text.charAt(0).toUpperCase() + text.slice(1);
        snippet = `${indentation}const [${text}, ${setterName}] = useState()`;
      } else if (parts.length === 2) {
        const [stateName, initialValue] = parts;
        const setterName =
          "set" + stateName.charAt(0).toUpperCase() + stateName.slice(1);
        snippet = `${indentation}const [${stateName}, ${setterName}] = useState(${initialValue})`;
      } else if (parts.length === 3) {
        const [stateName, type, initialValue] = parts;
        const setterName =
          "set" + stateName.charAt(0).toUpperCase() + stateName.slice(1);
        snippet = `${indentation}const [${stateName}, ${setterName}] = useState<${type}>(${initialValue})`;
      } else {
        vscode.window.showErrorMessage("Invalid format 🥲");
        return;
      }

      await editor.edit((editBuilder) => {
        editBuilder.replace(range, snippet);
      });

      const newPosition = new vscode.Position(
        range.start.line,
        range.start.character + snippet.length - 1
      );
      editor.selection = new vscode.Selection(newPosition, newPosition);
    }
  );

  context.subscriptions.push(
    setterCompletionProvider,
    addSetPrefix,
    removeSetPrefix,
    createUseState
  );
}

export function deactivate() {}
