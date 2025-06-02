# AutoAgent Project Development Standards

## Project Overview

**AutoAgent** is a hierarchical multi-agent orchestration system for executing complex projects. The system features:
- **Frontend**: React 19 + TypeScript + Tailwind CSS + Shadcn UI + Zustand
- **Architecture**: Feature-based modular design with Chat + Canvas interface
- **Testing**: Comprehensive Vitest setup with coverage reporting
- **Quality**: Strict ESLint + Prettier configuration for React 19

## Frontend Architecture Standards

### Directory Structure Rules

- **MUST** follow feature-based architecture: `frontend/src/features/{feature-name}/`
- **MUST** organize components by domain: `components/`, `hooks/`, `store/`, `types/`
- **MUST** place shared UI components in: `frontend/src/components/ui/`
- **MUST** place common components in: `frontend/src/components/common/`
- **MUST** use index.ts files for clean exports in each feature directory

### Component Development Standards

#### React 19 Compatibility Rules

- **MUST** use React 19 JSX transform (no React import needed)
- **MUST** disable `react/react-in-jsx-scope` and `react/jsx-uses-react` ESLint rules
- **MUST** use TypeScript for prop validation (no PropTypes)
- **MUST** follow React 19 best practices for hooks and state management

#### Component Structure Requirements

- **MUST** create components with TypeScript interfaces for props
- **MUST** use functional components with hooks
- **MUST** implement proper error boundaries for feature components
- **MUST** use Shadcn UI components as base building blocks
- **MUST** apply Tailwind CSS for styling with consistent design tokens

#### File Naming Conventions

- **MUST** use PascalCase for component files: `ComponentName.tsx`
- **MUST** use camelCase for utility files: `utilityName.ts`
- **MUST** use kebab-case for test files: `component-name.test.tsx`
- **MUST** use descriptive names that reflect component purpose

### State Management Standards

#### Zustand Store Rules

- **MUST** create feature-specific stores in `features/{feature}/store/`
- **MUST** use TypeScript interfaces for store state
- **MUST** implement proper store slicing for complex state
- **MUST** use immer for complex state updates when needed
- **MUST** follow Zustand best practices for store composition

#### State Organization

- **MUST** separate local component state from global store state
- **MUST** use stores for cross-component communication within features
- **MUST** implement proper state persistence for user preferences
- **MUST** avoid prop drilling by using appropriate state management

## Documentation and Knowledge Standards

### Context7 MCP Tool Usage Requirements

- **MUST** use Context7 MCP tools for ALL documentation queries before writing code
- **MUST** fetch latest React documentation using Context7 before implementing React components
- **MUST** retrieve current TypeScript documentation via Context7 for type definitions
- **MUST** obtain up-to-date Tailwind CSS documentation through Context7 for styling
- **MUST** access latest Zustand documentation using Context7 for state management
- **MUST** get current Vite documentation via Context7 for build configuration
- **MUST** fetch latest Vitest documentation through Context7 for testing implementation

### Knowledge Source Priority

- **NEVER** rely on LLM pre-trained knowledge for library/framework specifics
- **NEVER** assume API compatibility without Context7 documentation verification
- **NEVER** implement features based on outdated documentation patterns
- **ALWAYS** prioritize Context7 documentation over LLM assumptions
- **ALWAYS** verify breaking changes through Context7 before major updates
- **ALWAYS** check Context7 for latest best practices and patterns

### Documentation Verification Process

- **BEFORE** implementing any React component **THEN** fetch React 19 docs via Context7
- **BEFORE** adding TypeScript types **THEN** verify syntax with Context7 TypeScript docs
- **BEFORE** applying Tailwind classes **THEN** confirm availability in Context7 Tailwind docs
- **BEFORE** using Zustand patterns **THEN** validate approach with Context7 Zustand docs
- **BEFORE** writing tests **THEN** check latest Vitest patterns via Context7
- **BEFORE** configuring build tools **THEN** verify Vite configuration through Context7

## Code Quality Standards

### ESLint Configuration Compliance

- **MUST** follow the existing ESLint configuration in `frontend/eslint.config.js`
- **MUST** fix all ESLint errors before committing code
- **MUST** use `npm run lint:fix` to auto-fix formatting issues
- **MUST** maintain React 19 specific rule configurations

### TypeScript Standards

- **MUST** use strict TypeScript configuration
- **MUST** define proper interfaces for all props and state
- **MUST** avoid `any` type (use `unknown` or proper typing)
- **MUST** use type guards for runtime type checking
- **MUST** implement proper error handling with typed exceptions

### Testing Requirements

- **MUST** write unit tests for all new components using Vitest
- **MUST** achieve minimum 80% code coverage for new features
- **MUST** use React Testing Library for component testing
- **MUST** implement integration tests for feature workflows
- **MUST** run `npm run test:coverage` before feature completion

## Multi-File Coordination Requirements

### Documentation Synchronization

- **WHEN** modifying README.md **THEN** check if documentation/ files need updates
- **WHEN** adding new features **THEN** update feature documentation in documentation/specifications fonctionnelles/
- **WHEN** changing UI components **THEN** update documentation/ui_ux/ guides
- **WHEN** modifying agent prompts **THEN** update corresponding documentation

### Frontend Component Dependencies

- **WHEN** modifying `frontend/src/components/ui/` **THEN** check all feature components for breaking changes
- **WHEN** updating Zustand stores **THEN** verify all consuming components
- **WHEN** changing shared hooks **THEN** test all dependent features
- **WHEN** modifying types **THEN** update all importing files

### Configuration File Coordination

- **WHEN** updating `package.json` **THEN** verify `package-lock.json` consistency
- **WHEN** modifying `eslint.config.js` **THEN** run linting on entire codebase
- **WHEN** changing `tsconfig.json` **THEN** verify TypeScript compilation
- **WHEN** updating `vite.config.ts` **THEN** test build process

## Development Workflow Standards

### Package Management Rules

- **MUST** use npm for dependency management (not yarn or pnpm)
- **MUST** use `npm install` for adding dependencies
- **MUST** run `npm run quality` before committing changes
- **MUST** update package.json through npm commands, not manual editing

### Git Workflow Standards

- **MUST** create feature branches for new development
- **MUST** write descriptive commit messages
- **MUST** ensure all tests pass before committing
- **MUST** maintain clean commit history

### Code Review Requirements

- **MUST** ensure TypeScript compilation succeeds
- **MUST** verify ESLint and Prettier compliance
- **MUST** confirm test coverage meets requirements
- **MUST** validate component integration with existing features

## AI Decision-Making Guidelines

### Priority Decision Tree

1. **Context7 Documentation**: ALWAYS fetch latest docs via Context7 before any implementation
2. **Code Quality**: Always prioritize type safety and ESLint compliance
3. **React 19 Compatibility**: Ensure all code follows React 19 patterns (verified via Context7)
4. **Feature Architecture**: Maintain feature-based organization
5. **Testing**: Implement comprehensive test coverage (using Context7 Vitest docs)
6. **Documentation**: Keep documentation synchronized with code changes

### Context7 Integration Requirements

- **WHEN** starting any development task **THEN** FIRST fetch relevant documentation via Context7
- **WHEN** encountering API errors **THEN** verify current API syntax through Context7
- **WHEN** implementing new patterns **THEN** confirm best practices via Context7 documentation
- **WHEN** debugging compatibility issues **THEN** check breaking changes through Context7
- **WHEN** unsure about library usage **THEN** consult Context7 before proceeding

### Ambiguous Situation Handling

- **WHEN** uncertain about component placement **THEN** choose feature-specific over shared
- **WHEN** unsure about state management **THEN** prefer local state over global store
- **WHEN** questioning testing approach **THEN** prioritize unit tests over integration tests
- **WHEN** debating styling approach **THEN** use Tailwind CSS over custom CSS
- **WHEN** facing any technical uncertainty **THEN** ALWAYS consult Context7 documentation first

## Prohibited Actions

### Documentation and Knowledge Sources

- **NEVER** implement code based solely on LLM pre-trained knowledge
- **NEVER** assume library APIs without Context7 verification
- **NEVER** skip Context7 documentation lookup for any library/framework usage
- **NEVER** rely on outdated patterns from LLM training data
- **NEVER** proceed with implementation without Context7 documentation confirmation

### Code Modifications

- **NEVER** manually edit package.json for dependencies
- **NEVER** disable ESLint rules without justification
- **NEVER** commit code with TypeScript errors
- **NEVER** use deprecated React patterns or lifecycle methods
- **NEVER** bypass the established feature architecture

### File Operations

- **NEVER** delete configuration files without backup
- **NEVER** modify node_modules directly
- **NEVER** commit sensitive information or API keys
- **NEVER** break existing component interfaces without migration plan

### Development Practices

- **NEVER** skip testing for new features
- **NEVER** ignore accessibility requirements
- **NEVER** implement features without proper TypeScript typing
- **NEVER** use inline styles instead of Tailwind CSS classes

## Implementation Examples

### ✅ Correct Development Workflow

```
1. FIRST: Fetch React 19 documentation via Context7
2. THEN: Verify TypeScript interface patterns via Context7
3. THEN: Confirm Tailwind CSS classes via Context7
4. FINALLY: Implement component with verified patterns
```

### ✅ Correct Component Structure (After Context7 Verification)

```typescript
// features/chat/components/ChatMessage.tsx
// ✅ Created after verifying React 19 + TypeScript patterns via Context7
interface ChatMessageProps {
  message: string;
  timestamp: Date;
  sender: string;
}

export const ChatMessage = ({ message, timestamp, sender }: ChatMessageProps) => {
  return (
    <div className="flex flex-col space-y-2 p-4 border rounded-lg">
      <span className="text-sm text-gray-500">{sender}</span>
      <p className="text-base">{message}</p>
      <time className="text-xs text-gray-400">{timestamp.toLocaleString()}</time>
    </div>
  );
};
```

### ❌ Incorrect Development Workflow

```
❌ Implementing based on LLM knowledge without Context7 verification
❌ Assuming React 19 patterns without documentation lookup
❌ Using Tailwind classes without confirming current syntax
```

### ❌ Incorrect Component Structure

```typescript
// Wrong: Missing types, inline styles, React import, no Context7 verification
import React from 'react';

export const ChatMessage = (props) => {
  return (
    <div style={{ padding: '16px', border: '1px solid gray' }}>
      <span>{props.sender}</span>
      <p>{props.message}</p>
    </div>
  );
};
```

This document serves as the definitive guide for AI agents working on the AutoAgent project, ensuring consistent development practices and maintaining code quality standards.
