# React-autoState

A VSCode extension that helps you efficiently manage React state variable names and their setter functions. This extension streamlines the process of creating useState hooks and converting between state variables and their setters.

## Features

### 1. add Setter Prefix

- When: Press `Ctrl+Alt+S` / `Cmd+Alt+S`
- Input: Selected state name (e.g., `isModalOpen`)
- Result: Copies `setIsModalOpen`

### 2. Remove Setter Prefix

- When: Press `Ctrl+Alt+R` / `Cmd+Alt+R`
- Input: Selected setter name (e.g., `setIsModalOpen`)
- Result: Copies `isModalOpen`

### 3. Setter Auto-completion

- When: Typing state name followed by comma
- Input: `count [count,`
- Result: Suggests `setCount`

### 4. useState Generation

- Execute command on current cursor line:
  ```
  stateName
  stateName^initialValue
  stateName^type^initialValue
  ```
- Examples:

  ```typescript
  // count^0
  const [count, setCount] = useState(0);

  // count^number^0
  const [count, setCount] = useState<number>(0);

  // count^number|undefined^0
  const [count, setCount] = useState<number | undefined>(0);
  ```

## Installation

1. Open VSCode
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "React State Prefix Manager"
4. Click Install
5. Reload VSCode

## Usage

### Keyboard Shortcuts

| Command             | Windows/Linux | Mac         | Action                           |
| ------------------- | ------------- | ----------- | -------------------------------- |
| Add 'set' Prefix    | Ctrl+Shift+S  | Cmd+Shift+S | Adds 'set' prefix to variable    |
| Remove 'set' Prefix | Ctrl+Shift+R  | Cmd+Shift+R | Removes 'set' prefix from setter |
| Create useState     | Ctrl+Shift+U  | Cmd+Shift+U | Creates complete useState hook   |

You can customize these shortcuts in VSCode's Keyboard Shortcuts settings.

## Contributing

If you'd like to contribute to this extension, please visit [repository](https://github.com/daangnkim/React-autoState)
