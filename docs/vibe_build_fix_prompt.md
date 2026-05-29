# Vibe Coding Portal Prompt: TypeScript Build Fix

*Copy and paste this entire prompt into the Vibe Coding portal chat input to resolve the build error and complete publishing.*

***

## CRITICAL BUILD FIX INSTRUCTION

Please stop trying to modify `package.json`, `tsconfig.json`, or any other configuration files outside of the `src/` directory. These files are write-protected by the platform, and trying to edit them will block the build.

Instead, please run the following command in your terminal to install the missing type definition package directly into `node_modules` without saving it to the write-protected `package.json`:

If using **npm**:
```bash
npm install --no-save @types/testing-library__jest-dom
```

If using **pnpm**:
```bash
pnpm install --save-false @types/testing-library__jest-dom
```

If using **yarn**:
```bash
yarn add --no-lockfile @types/testing-library__jest-dom
```

This will place the required type definitions in `node_modules/@types/testing-library__jest-dom` so that the TypeScript compiler can find the implicit type library and pass the build check, without attempting to modify the write-protected configuration files.

After running the install command, please verify the build status and proceed to publish the application immediately.
