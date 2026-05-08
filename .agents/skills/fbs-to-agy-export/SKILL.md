---
name: fbs-to-agy-export
description: >
  Prepares a Firebase Studio exported project for use with Antigravity.
  Make sure to use this skill whenever the user mentions "Antigravity export", "Firebase Studio export", or wants to finalize, finish, or set up a Firebase Studio project. Even if they just say "get me started with this export" or "export to AGY", this is the skill to use.
---


# Preparing Firebase Studio Projects for Antigravity

Prepare a Firebase Studio exported project for use with Antigravity. You must execute these steps sequentially because later steps depend on the environment and dependencies set up in earlier steps. Do not skip steps unless explicitly instructed by a conditional evaluation.

## Workflow Instructions

### Prerequisites: Context Gathering

Determine the following variables before executing any commands. If automatic determination fails, ask the user. 

> [!IMPORTANT]
> **Maintain State**: These variables define the **Current Project State**. You MUST refer to these values before every conditional step.

1.  **Determine Target Folder (`<TARGET_FOLDER>`)**:
    *   The folder is valid only if it contains an `.idx/` subdirectory.
    *   Check if the current working directory contains `.idx/`. If so, set `<TARGET_FOLDER>` to the current directory.
    *   If not, stop and ask the user to provide the correct absolute path to the project folder.
2.  **Determine the type of project (`<FBS_PROJECT_TYPE>`)**:
    *   If the project contains `next.config.ts`, set `<FBS_PROJECT_TYPE>` to "NextJS".
    *   If the project contains `pubspec.yaml`, set `<FBS_PROJECT_TYPE>` to "Flutter".
    *   If the project contains `angular.json`, set `<FBS_PROJECT_TYPE>` to "Angular".
    *   Otherwise, attempt to determine the project type by checking the project's primary language.

### Step 1: Verify Node.js Environment (>= 20)

Firebase Studio exports require a modern Node.js environment (>= v20) to run build tools and servers. You must ensure this base requirement is met before proceeding.

1.  **Check Version**: Execute `node --version` in the terminal.
2.  **Evaluate Result**:
    *   If the version is `>= v20.x.x`, validation passes. Proceed immediately to **Step 2**.
    *   If the version is `< v20.x.x`, or if Node.js is not found, perform one of the remediation paths below based on the OS.

#### Remediation Path: macOS / Linux

Attempt to install Node.js 24 using `nvm`.

1.  **Install nvm**:
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash
    ```
2.  **Load nvm**: Source the configuration file for the active shell (e.g., `source ~/.bash_profile`, `source ~/.bashrc`, `source ~/.zprofile`, `source ~/.zshrc`, or `source ~/.profile`).
3.  **Install Node**:
    ```bash
    nvm install 24
    nvm use 24
    ```
4.  **Verify**: Run `node --version`. If it is now `>= v20.x.x`, proceed to **Step 2**. If it fails, fallback to the **Manual Installation** path.

#### Remediation Path: Windows

Guide the user to use `nvm-windows`.

1.  **Instruct**: Ask the user to download and install [nvm-windows](https://github.com/coreybutler/nvm-windows/releases).
2.  **Wait**: **Stop and wait** for the user to confirm they have installed `nvm-windows`. Do not execute further steps until they reply.
3.  **Install Node**: Once confirmed, install Node.js 24:
    ```bash
    nvm install 24
    nvm use 24
    ```
4.  **Verify**: Run `node --version`. If it is now `>= v20.x.x`, proceed to **Step 2**. If it fails, fallback to the **Manual Installation** path.

#### Remediation Path: Manual Installation (Fallback)

Use this path if automated tools fail or the OS is unsupported.

1.  **Instruct**: Ask the user to download and manually install Node.js 24+ directly from [nodejs.org](https://nodejs.org/en/download).
2.  **Wait**: **Stop and wait** for the user to confirm the installation is complete.
3.  **Verify**: Run `node --version`. Validate it is `>= v20.x.x` before proceeding to **Step 2**.

### Step 2: Firebase Login and Export

1.  **Login**: Ensure the user is authenticated with the Firebase CLI.
    ```bash
    npx -y firebase-tools@latest login
    ```
    *(Timeout Warning: If this command hangs waiting for browser interaction, check the terminal output, extract the login URL, provide it to the user, and stop waiting. Do not block indefinitely.)*
2.  **Export Project**: Execute the export command using the information gathered in the Prerequisites.
    ```bash
    npx -y firebase-tools@latest studio:export <TARGET_FOLDER> --no-start-antigravity
    ```

### Step 3: Build Local Knowledge

To minimize repeating investigation work in future sessions, you must codify the build and preview commands that you have discovered into reusable Antigravity workflows. 

Create the following two workflow files in the target project folder:
- `<TARGET_FOLDER>/.agents/workflows/build_project.md`: Write a step-by-step workflow detailing every command required to install dependencies, compile, and build the project.
- `<TARGET_FOLDER>/.agents/workflows/preview_project.md`: Write a step-by-step workflow detailing the exact commands needed to start the preview server and test the project.

### Step 4: Restart Antigravity

Instruct the user to restart their Antigravity IDE environment so that all configurations take effect.

1.  **Instruct**: Tell the user they must restart Antigravity IDE to pick up the changes.
2.  **Wait**: **Stop and wait** for the user to confirm they have restarted their IDE.

---
**Completion:** Once all steps above (including Step 4) have been successfully handled, notify the user that the Firebase Studio project export and Antigravity preparation are complete.

---
## Examples

**Example 1: User requests export**
Input: Can you help me finish this Firebase Studio export?
Output: 
- Invokes `fbs-to-agy-export` skill.
- Checks for `.idx/` in current folder.
- Discovers `.idx/` exists. Sets `<TARGET_FOLDER>` to `.`.
- Discovers `next.config.ts`. Sets `<FBS_PROJECT_TYPE>` to "NextJS".
- (Proceeds to Step 1...)

**Example 2: Target folder unclear**
Input: Export to Antigravity.
Output:
- Invokes `fbs-to-agy-export` skill.
- Checks for `.idx/` in current folder. Not found.
- Asks user: "Please provide the absolute path to the project folder containing the `.idx/` subdirectory."
- (Upon user answering with `/Users/user/my-app`) Sets `<TARGET_FOLDER>` to `/Users/user/my-app`.
- (Proceeds with prerequisites check...)
