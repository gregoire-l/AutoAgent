# AutoAgent Frontend

A modern React application built with React 19, TypeScript, Vite, Tailwind CSS, and Zustand for state management. This application features an advanced agent orchestrator with Chat + Canvas interface and comprehensive mission clarification simulation.

## 🚀 Features

### Core Functionality
- **Agent Orchestrator**: Advanced AI agent simulation with intent recognition
- **Chat Interface**: Real-time messaging with typing indicators and smooth animations
- **Canvas Interface**: Interactive mission visualization with real-time status updates
- **Mission Clarification Flow**: Complete simulation of the Lyon-Paris travel planning scenario

### Technical Highlights
- **React 19**: Latest React features with concurrent rendering
- **TypeScript**: Full type safety with strict configuration
- **Zustand**: Lightweight state management with slices pattern
- **Tailwind CSS**: Utility-first styling with custom design system
- **Shadcn UI**: High-quality component library
- **Vitest**: Modern testing framework with React Testing Library
- **Feature-based Architecture**: Modular, scalable project structure

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/           # Shared UI components
│   │   ├── ui/              # Shadcn UI components
│   │   └── common/          # Custom shared components
│   ├── features/            # Feature-based modules
│   │   ├── chat/           # Chat functionality
│   │   ├── canvas/         # Canvas/mission visualization
│   │   └── mission-clarification/  # Clarification flow
│   │       ├── components/ # Flow-specific components
│   │       ├── hooks/      # Custom hooks
│   │       ├── store/      # Zustand slice
│   │       ├── types/      # TypeScript definitions
│   │       ├── data/       # Scripted content & configuration
│   │       └── integration/ # Integration tests
│   ├── lib/                # Utilities and configuration
│   ├── store/              # Global Zustand store
│   └── test/               # Test configuration
├── tests/                  # Additional test files
└── docs/                   # Documentation
```

## 🎯 Mission Clarification Flow

The application implements a sophisticated mission clarification simulation that follows the exact user story from `a2-a3_clarification-mission.md`:

### Flow Phases
1. **A1 (Welcome)**: User sees pre-filled Lyon-Paris example
2. **A2 (Clarification)**: Agent asks clarifying questions with canvas updates
3. **A3 (Finalization)**: Mission details are confirmed and finalized

### Key Components
- **ClarificationFlowManager**: Orchestrates the entire flow state machine
- **Pre-scripted Content System**: Manages realistic agent responses and timing
- **Canvas Integration**: Real-time status updates with smooth animations
- **Agent Simulator**: Handles intent recognition and response generation

### Features
- ✅ Pre-filled Lyon-Paris example message
- ✅ Smooth transition animations
- ✅ Real-time canvas status updates
- ✅ Interactive canvas elements (buttons, radio groups)
- ✅ Bidirectional Chat ↔ Canvas communication
- ✅ Realistic typing indicators and delays
- ✅ Complete A2→A3 phase progression
- ✅ Comprehensive test coverage
- ✅ Full accessibility compliance (WCAG 2.1)

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Testing
```bash
# Run tests in watch mode
npm run test

# Run tests once
npm run test:run

# Run with coverage
npm run test:coverage

# Run with UI
npm run test:ui
```

### Code Quality
```bash
# Lint and format
npm run quality:fix

# Type checking
npm run type-check

# Check all quality gates
npm run quality
```

## 🧪 Testing Strategy

### Test Coverage
- **Unit Tests**: Individual components and functions
- **Integration Tests**: Complete user flows and component interactions
- **Accessibility Tests**: WCAG 2.1 compliance with jest-axe
- **Store Tests**: Zustand slice behavior and state management
- **Hook Tests**: Custom hook logic and side effects

### Test Files
- `*.test.tsx` - Component tests
- `*.test.ts` - Logic and utility tests
- `*.integration.test.tsx` - Integration tests
- `*.a11y.test.tsx` - Accessibility tests

### Testing Tools
- **Vitest**: Test runner with Jest-compatible API
- **React Testing Library**: Component testing utilities
- **jest-axe**: Accessibility testing
- **@testing-library/user-event**: User interaction simulation

## ♿ Accessibility

The application maintains WCAG 2.1 AA compliance with:

- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and live regions
- **Color Contrast**: Sufficient contrast ratios
- **Focus Management**: Logical focus flow
- **Reduced Motion**: Respects user motion preferences
- **Touch Targets**: Minimum 44x44px interactive areas

## 🏗️ Architecture Patterns

### State Management
- **Zustand Store**: Global state with slice pattern
- **Feature Slices**: Isolated state per feature
- **Computed Selectors**: Derived state calculations
- **Optimistic Updates**: Immediate UI feedback

### Component Patterns
- **Compound Components**: Complex UI composition
- **Render Props**: Flexible component APIs
- **Custom Hooks**: Reusable stateful logic
- **Error Boundaries**: Graceful error handling

### Performance Optimizations
- **React.memo**: Prevent unnecessary re-renders
- **useCallback/useMemo**: Memoized functions and values
- **Code Splitting**: Lazy-loaded route components
- **Bundle Optimization**: Tree shaking and minification
